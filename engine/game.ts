import { Mutex } from "async-mutex";
import { elementsOfKind } from "./util/loader";
import { makePersistedObject, PersistedObject } from "./util/persisted-object";
import { getAnchorParent, getAnchorShape, Item } from "./elements/item";
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
  controls: Record<string, Control> = {};
  currentPlace?: Place;
  loadingPlace?: string;
  places: Record<string, Place> = {};
  mousePos: XY;
  audioContext: AudioContext;
  sounds: Record<string, Sound>;
  anchoredElements: [SVGElement | HTMLElement, AnchorPlacement][] = [];

  items: Record<string, Item> = {}; // use getItemById instead
  private itemsMutex = new Mutex();

  constructor() {
    this.state = makePersistedObject("game_state", {
      currentPlace: "__start__",
      elementStates: {},
      anchoredItems: {},
      onceSpawnedItems: [],
    });

    this.state.subscribeChild("currentPlace", (place, oldPlace) => {
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
    void elementsOfKind("controls").then((controls) =>
      controls.forEach(async (controlName) => {
        this.controls[controlName] = await Control.loadControl(controlName);
      }),
    );

    this.sounds = {};

    this.audioContext = new AudioContext();
    // we need to "unblock" the audio context at the first user interaction
    const events = ["touchstart", "touchend", "mousedown", "keydown"];
    const unlock = () => {
      void this.audioContext.resume().then(clean);
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

  navigate(place: string) {
    (async () => {
      if (this.loadingPlace == place) return;
      if (this.currentPlace) {
        this.currentPlace.leaveCallbacks.forEach((c) => c());
      }

      console.log(`loading place: ${place}`);
      this.loadingPlace = place;
      this.state.currentPlace = place;
      await this.relayoutAnchors(true);

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
    })();
  }

  async getItemById(id: string): Promise<Item> {
    await this.itemsMutex.runExclusive(async () => {
      if (!(id in this.items)) {
        console.log("loading item", id);
        const itemName = id.split(":", 2)[0];
        this.items[id] = await Item.loadItem(itemName, id);
      }
    });
    return this.items[id];
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
    game.state.onceSpawnedItems.push(id);
    const itemObject = await this.getItemById(id);
    return itemObject.anchor(slot, anchorOptions);
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

  async relayoutAnchors(force = false) {
    if (this.loadingPlace && !force) return;

    const viewport = document.getElementById("viewport");
    if (!viewport) throw Error("viewport container is gone");

    const anchoredElements = [...this.anchoredElements];
    for (const item of Object.keys(this.state.anchoredItems)) {
      const itemObject = await this.getItemById(item);
      anchoredElements.push([
        itemObject.svgElement,
        this.state.anchoredItems[item],
      ]);
    }

    for (const [element, placement] of anchoredElements) {
      const parent = getAnchorParent(placement);
      const anchorShape = getAnchorShape(placement);
      if (!parent || !anchorShape) {
        if (viewport.contains(element)) {
          viewport.removeChild(element);
        }
        continue;
      }

      const atRect = anchorShape.svgElement.getBoundingClientRect();

      let width = 0,
        height = 0;
      if (placement.options.size == "real") {
        if (!(element instanceof SVGElement)) {
          throw Error("only SVG elements can be anchored with size = 'real'");
        }
        const scale = getSvgScale(parent.svgElement);
        const viewBox = getSvgViewBox(element);
        width = viewBox.width * scale;
        height = viewBox.height * scale;
      } else if (placement.options.size == "fill") {
        width = atRect.width;
        height = atRect.height;
      }

      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.style.transform = "translate(-50%, -50%)";

      element.style.position = "absolute";
      element.style.left = `${atRect.left + atRect.width / 2}px`;
      element.style.top = `${atRect.top + atRect.height / 2}px`;

      element.style.visibility = window.getComputedStyle(
        anchorShape.svgElement,
      ).visibility;

      if (!viewport.contains(element)) {
        viewport.appendChild(element);
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
