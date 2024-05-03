import { elementsOfKind } from "./util/loader";
import { makePersistedObject, PersistedObject } from "./util/persisted-object";
import { Item } from "./elements/item";
import { Place } from "./elements/place";
import { EngineShape } from "./elements/engine-shape";
import { Control } from "./elements/control";
import { Sound } from "./elements/sound";

import { getSvgScale, getSvgViewBox } from "./util/svg-utils";

export type DnDHandler = (item: Item) => void;

export type XY = { x: number; y: number };

export class Game {
  state: PersistedObject<GameState>;

  // state shared with code in the elements folder (but private to the engine)
  dragStartListeners: DnDHandler[] = [];
  dragEndListeners: DnDHandler[] = [];
  dropListeners: [EngineShape, DnDHandler][] = [];
  items: Record<string, Item> = {};
  controls: Record<string, Control> = {};
  currentPlace?: Place;
  loadingPlace?: string;
  mousePos: XY;
  audioContext: AudioContext;
  sounds: Record<string, Sound>;

  constructor() {
    this.state = makePersistedObject("game_state", {
      currentPlace: "__start__",
      elementStates: {},
      anchoredItems: {},
      onceSpawnedItems: [],
    });

    this.state.subscribeChild("currentPlace", async (place, oldPlace) => {
      if (place == oldPlace) return;
      this.navigate(place);
    });

    this.state.subscribeChild("anchoredItems", () => this.relayoutAnchors());
    window.addEventListener("resize", () => this.relayoutAnchors());

    this.mousePos = { x: 0, y: 0 };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if ("clientX" in e) {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
      } else {
        this.mousePos.x = e.touches[0].clientX;
        this.mousePos.y = e.touches[0].clientY;
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);

    // load controls
    elementsOfKind("controls").then((controls) =>
      controls.forEach(async (controlName) => {
        this.controls[controlName] = await Control.loadControl(controlName);
      }),
    );

    this.sounds = {};

    this.audioContext = new AudioContext();
    // we need to "unblock" the audio context at the first user interaction
    const events = ["touchstart", "touchend", "mousedown", "keydown"];
    const unlock = () => {
      this.audioContext.resume().then(clean);
    };
    events.forEach((e) => document.body.addEventListener(e, unlock, false));
    function clean() {
      events.forEach((e) => document.body.removeEventListener(e, unlock));
    }
  }

  reset() {
    window.localStorage.removeItem("game_state");
    window.location.reload();
  }

  async navigate(place: string): Promise<void> {
    if (this.loadingPlace == place) return;
    if (this.currentPlace) {
      this.currentPlace.leaveCallbacks.forEach((c) => c());
    }

    console.log(`loading place: ${place}`);
    this.loadingPlace = place;

    this.state.currentPlace = place;
    const pageContainer = document.getElementById("page");
    if (!pageContainer) throw Error("page container is gone");

    pageContainer.style.transition = "";
    pageContainer.style.opacity = "0";

    const placeObject = await Place.loadPlace(place);
    this.currentPlace = placeObject;
    pageContainer.replaceChildren(placeObject.svgElement);
    this.loadingPlace = undefined;
    await this.relayoutAnchors();

    // TODO: only do this after we are really done loading the next page
    pageContainer.style.transition = "opacity 0.5s";
    pageContainer.style.opacity = "1";
  }

  async spawnItem(
    item: string,
    slot: EngineShape,
    anchorOptions: Partial<AnchorOptions> = {},
    id_extra = "",
  ): Promise<Item> {
    let id = item;
    if (id_extra) {
      id = `${item}:${id_extra}`;
    }
    if (!(id in this.items)) {
      console.log("loading item", item, name);
      this.items[id] = await Item.loadItem(item, id);
    }
    this.state.onceSpawnedItems.push(id);
    return this.items[id].anchor(slot, anchorOptions);
  }

  async spawnItemOnce(
    item: string,
    slot: EngineShape,
    anchorOptions: Partial<AnchorOptions> = {},
    id_extra = "",
  ): Promise<Item | null> {
    let id = item;
    if (id_extra) {
      id = `${item}:${id_extra}`;
    }
    if (game.state.onceSpawnedItems.includes(id)) {
      return null;
    }
    return this.spawnItem(item, slot, anchorOptions, id_extra);
  }

  getCurrentPlace(): Place {
    if (!this.currentPlace) throw Error("current place is undefined");
    return this.currentPlace;
  }

  async relayoutAnchors() {
    if (this.loadingPlace) return;

    const viewport = document.getElementById("viewport");
    if (!viewport) throw Error("viewport container is gone");

    for (const [element, placement] of Object.entries(
      this.state.anchoredItems,
    )) {
      // TDOO: for now we can only anchor items

      if (!(element in this.items)) {
        console.log("loading item", element);
        const itemName = element.split(":", 2)[0];
        this.items[element] = await Item.loadItem(itemName, element);
      }
      const item = this.items[element];

      const parent = item.getAnchorParent();
      const anchorShape = item.getAnchorShape();
      if (!parent || !anchorShape) {
        if (viewport.contains(item.svgElement)) {
          console.log(`removing item ${element} from dom`);
          viewport.removeChild(item.svgElement);
        }
        continue;
      }

      const atRect = anchorShape.svgElement.getBoundingClientRect();

      let width = 0,
        height = 0;
      if (placement.options.size == "real") {
        const scale = getSvgScale(parent.svgElement);
        const viewBox = getSvgViewBox(item.svgElement);
        width = viewBox.width * scale;
        height = viewBox.height * scale;
      } else if (placement.options.size == "fill") {
        width = atRect.width;
        height = atRect.height;
      }

      item.svgElement.style.width = `${width}px`;
      item.svgElement.style.height = `${height}px`;

      item.svgElement.style.position = "absolute";
      item.svgElement.style.left = `${atRect.left + atRect.width / 2}px`;
      item.svgElement.style.top = `${atRect.top + atRect.height / 2}px`;

      item.svgElement.style.visibility = window.getComputedStyle(
        anchorShape.svgElement,
      ).visibility;

      if (!viewport.contains(item.svgElement)) {
        console.log(`connecting item ${element} to dom`);
        viewport.appendChild(item.svgElement);
      }
    }
  }

  getItemFromDomElement(element: Element | null): Item | null {
    if (!element) return null;
    for (item of Object.values(this.items)) {
      if (item.svgElement == element || item.svgElement.contains(element)) {
        return item;
      }
    }
    return null;
  }

  getSound(file: string, id?: string): Sound {
    const realId = id || file;
    if (!(realId in this.sounds)) {
      this.sounds[realId] = new Sound(file, realId);
    }
    return this.sounds[realId];
  }
}
