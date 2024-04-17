import { elementsOfKind } from "./util/loader";
import { makePersistedObject, PersistedObject } from "./util/persisted-object";
import { Item } from "./elements/item";
import { Place } from "./elements/place";
import { EngineShape } from "./elements/engine-shape";
import { Control } from "./elements/control";
import { getSvgScale, getSvgViewBox } from "./util/svg-utils";

export type DnDHandler = (item: Item) => void;
export type DropHandler = (item: Item) => unknown;

export type XY = { x: number; y: number };

export class Game {
  state: PersistedObject<GameState>;

  // state shared with code in the elements folder (but private to the engine)
  dragStartListeners: DnDHandler[] = [];
  dragEndListeners: DnDHandler[] = [];
  dropListeners: [EngineShape, DropHandler][] = [];
  items: Record<string, Item> = {};
  controls: Record<string, Control> = {};
  currentPlace?: Place;
  loadingPlace?: string;
  mousePos: XY;

  constructor() {
    this.state = makePersistedObject("game_state", {
      currentPlace: "__start__",
      elementStates: {},
      anchoredItems: {},
    });

    this.state.subscribeChild("currentPlace", async (place, oldPlace) => {
      if (place == oldPlace) return;
      this.navigate(place);
    });

    this.state.subscribeChild("anchoredItems", () => this.relayoutAnchors());
    window.addEventListener("resize", () => this.relayoutAnchors());

    this.mousePos = {x: 0, y: 0};
    const onMove = (e: MouseEvent | TouchEvent) => {
      if ("clientX" in e) {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
      } else {
        this.mousePos.x = e.touches[0].clientX;
        this.mousePos.y = e.touches[0].clientY;
      }
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);

    // load controls
    elementsOfKind("controls").then((controls) =>
      controls.forEach(async (controlName) => {
        this.controls[controlName] = await Control.loadControl(controlName);
      }),
    );
  }

  reset() {
    window.localStorage.removeItem("game_state");
    window.location.reload();
  }

  async navigate(place: string): Promise<void> {
    if (this.loadingPlace == place) return;
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

  async loadOrGetItem(item: string, name = "0"): Promise<Item> {
    const id = `${item}_${name}`;
    if (!(id in this.items)) {
      console.log("loading item", item, name);
      this.items[id] = await Item.loadItem(item, id);
    }
    return this.items[id];
  }

  getCurrentPlace(): Place {
    if (!this.currentPlace) throw Error("current place is undefined");
    return this.currentPlace;
  }

  async relayoutAnchors() {
    if (this.loadingPlace) return;
    console.log("relayoutAnchors()");

    const viewport = document.getElementById("viewport");
    if (!viewport) throw Error("viewport container is gone");

    for (const [element, placement] of Object.entries(
      this.state.anchoredItems,
    )) {
      // TDOO: for now we can only anchor items
      const [itemName, name] = element.split("_", 2);
      const item = await this.loadOrGetItem(itemName, name);

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
}
