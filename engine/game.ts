import { Mutex } from "async-mutex";
import { elementsOfKind, preloadResources } from "./util/loader";
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
  topZIndex: number = 1;
  started = false;
  initialLoadingDone = false;
  exibitionModeTimeout: NodeJS.Timeout | undefined;

  config = makePersistedObject("game_config", {
    exibitionMode: false,
    exibitionModeTimeoutMs: 15 * 60 * 1000,
  });

  items: Record<string, Item> = {}; // use getItemById instead
  private itemsMutex = new Mutex();

  constructor() {
    this.state = makePersistedObject("game_state", {
      currentPlace: "__start__",
      elementStates: {},
      anchoredItems: {},
      onceSpawnedItems: [],
    });

    const inputEvents = ["touchstart", "touchend", "mousedown", "keydown"];
    const resetTimeout = () => {
      if (this.exibitionModeTimeout) {
        clearTimeout(this.exibitionModeTimeout);
      }
      this.exibitionModeTimeout = setTimeout(() => {
        if (!this.config.exibitionMode) return;
        game.reset();
      }, this.config.exibitionModeTimeoutMs);
    };
    inputEvents.forEach((e) => document.body.addEventListener(e, resetTimeout, false));


    this.state.subscribeChild("currentPlace", (place, oldPlace) => {
      if (place == oldPlace) return;
      if (!this.started) return;
      this.navigate(place);
    });

    if (elementsOfKind("places").includes("__splash__")) {
      console.log("Game has splash. Loading it...");
      this.navigate("__splash__");
    } else {
      this.start();
    }

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
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    this.sounds = {};

    this.audioContext = new AudioContext();
    // we need to "unblock" the audio context at the first user interaction
    const unlock = () => {
      void this.audioContext.resume().then(clean);
    };
    inputEvents.forEach((e) => document.body.addEventListener(e, unlock, false));
    function clean() {
      inputEvents.forEach((e) => document.body.removeEventListener(e, unlock));
    }

    this.initialLoadingDone = true;
  }

  async loadControls() {
    await Promise.all(
      elementsOfKind("controls").map(async (controlName) => {
        this.controls[controlName] = await Control.loadControl(controlName);
      }),
    );
  }

  start() {
    if (this.started) return;
    void this.loadControls();
    this.started = true;
    this.navigate(this.state.currentPlace);
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
      if (place != "__splash__") {
        this.state.currentPlace = place;
        if (!this.started) {
          this.start();
        }
      }

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
    this.state.onceSpawnedItems.push(id);
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
    if (this.state.onceSpawnedItems.includes(id)) {
      return null;
    }
    return this.spawnItem(item, slot, anchorOptions, id_extra);
  }

  async spawnItemUnique(
    item: string,
    slot: EngineShape,
    anchorOptions: Partial<AnchorOptions> = {},
  ): Promise<Item | null> {
    const randomId = (Math.random() + 1).toString(36).substring(7);
    return this.spawnItem(item, slot, anchorOptions, randomId);
  }

  getCurrentPlace(): Place {
    if (!this.currentPlace) throw Error("current place is undefined");
    return this.currentPlace;
  }

  async relayoutAnchors(force = false) {
    if (!this.initialLoadingDone) return;
    if (this.loadingPlace && !force) return;

    const viewport = document.getElementById("viewport");
    if (!viewport) throw Error("viewport container is gone");

    const anchoredElements = [...this.anchoredElements];
    for (const [item, placement] of Object.entries(this.state.anchoredItems)) {
      if (!getAnchorParent(placement) && !(item in this.items)) return;
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

  async preloadResources(progressCallback: (progress: number) => void) {
    await preloadResources(progressCallback);
  }
}
