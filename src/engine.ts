import { loadSvg, loadTs } from "./loader";
import { makeNotPresentObject } from "./not-present";
import { makePersistedObject, PersistedObject } from "./persisted-object";
import {
  getSvgElementByLabel,
  getSvgElementsByLabelPattern,
  getSvgViewBox,
} from "./svg-utils";

export class Game {
  currentPlace?: Place;
  state: PersistedObject<GameState>;

  dragStartListeners: DnDHandler[] = [];
  dragEndListeners: DnDHandler[] = [];
  dropListeners: [EngineShape, DnDHandler][] = [];

  constructor() {
    this.state = makePersistedObject("game_state", {
      currentPlace: "__start__",
      itemStates: {},
    });
    this.state.subscribeChild("currentPlace", async (place, oldPlace) => {
      if (place == oldPlace) return;
      this.navigate(place);
    });
  }

  reset() {
    window.localStorage.removeItem("game_state");
    window.location.reload();
  }

  async navigate(place: string): Promise<void> {
    console.log(`loading place: ${place}`);
    this.state.currentPlace = place;
    const pageContainer = document.getElementById("page");
    if (!pageContainer) throw Error("page container is gone");

    pageContainer.style.transition = "";
    pageContainer.style.opacity = "0";

    const svg = await loadSvg(`places/${place}.svg`);
    if (svg) {
      pageContainer.replaceChildren(svg);
      this.currentPlace = new Place(svg);
    }
    await loadTs(`places/${place}.ts`, { place: this.currentPlace });

    // TODO: only do this after we are really done loading the next page
    pageContainer.style.transition = "opacity 0.5s";
    pageContainer.style.opacity = "1";
  }

  async loadItem(item: string, name = "0") {
    const svgElement = await loadSvg(`items/${item}.svg`);
    if (!svgElement) {
      throw Error(`item named '${item}' does not exist`);
    }
    const compiledName = `${item}_${name}`;
    if (!(name in game.state.itemStates)) {
      game.state.itemStates[compiledName] = {};
    }
    return new Item(compiledName, svgElement);
  }

  getCurrentPlace(): Place {
    if (!this.currentPlace) throw Error("current place is undefined");
    return this.currentPlace;
  }
}

type DnDHandler = (item: Item) => void;

export class EngineShape {
  svgElement: SVGElement;

  constructor(svgElement: SVGElement) {
    this.svgElement = svgElement;
  }

  onClick(handler: () => void): this {
    this.svgElement.style.cursor = "pointer";
    this.svgElement.addEventListener("click", () => handler());
    return this;
  }

  onOtherDragStart(handler: DnDHandler): this {
    game.dragStartListeners.push(handler);
    return this;
  }

  onOtherDragEnd(handler: DnDHandler): this {
    game.dragEndListeners.push(handler);
    return this;
  }

  onOtherDrop(handler: DnDHandler): this {
    game.dropListeners.push([this, handler]);
    return this;
  }

  hide(): this {
    this.svgElement.style.opacity = "0";
    return this;
  }
  show(): this {
    this.svgElement.style.opacity = "1";
    return this;
  }
}

export class Place {
  svgElement: SVGElement;

  constructor(svgElement: SVGElement) {
    this.svgElement = svgElement;
  }

  get(name: string): EngineShape {
    return new EngineShape(getSvgElementByLabel(this.svgElement, name));
  }

  getMany(pattern: RegExp): EngineShape[] {
    return getSvgElementsByLabelPattern(this.svgElement, pattern).map(
      (x) => new EngineShape(x),
    );
  }

  svgScale(): number {
    const { width, height } = this.svgElement.getBoundingClientRect();
    const viewBox = getSvgViewBox(this.svgElement);
    const scaleX = width / viewBox.width;
    const scaleY = height / viewBox.height;
    return Math.min(scaleX, scaleY);
  }
}

export class Item {
  state: unknown;
  svgElement: SVGElement;

  constructor(name: string, svgElement: SVGElement) {
    this.state = game.state.itemStates[name];
    this.svgElement = svgElement;
  }

  place(at: EngineShape): Item {
    const pageContainer = document.getElementById("page");
    if (!pageContainer) throw Error("page container is gone");

    const scale = game.getCurrentPlace().svgScale();
    const viewBox = getSvgViewBox(this.svgElement);
    const width = viewBox.width * scale;
    const height = viewBox.height * scale;
    this.svgElement.style.width = `${width}px`;
    this.svgElement.style.height = `${height}px`;

    const atRect = at.svgElement.getBoundingClientRect();

    this.svgElement.style.position = "absolute";
    this.svgElement.style.left = `${atRect.left + (atRect.width - width) / 2}px`;
    this.svgElement.style.top = `${atRect.top + (atRect.height - height) / 2}px`;

    pageContainer.appendChild(this.svgElement);

    return this;
  }

  draggable(handleLabel: string) {
    const handle = this.get(handleLabel);
    handle.svgElement.style.cursor = "grab";

    const draggingState = { startMouseX: 0, startMouseY: 0 };
    let startRect = this.svgElement.getBoundingClientRect();
    handle.svgElement.addEventListener("mousedown", (e) => {
      startRect = this.svgElement.getBoundingClientRect();
      draggingState.startMouseX = e.clientX;
      draggingState.startMouseY = e.clientY;
      handle.svgElement.style.cursor = "grabbing";
      game.dragStartListeners.forEach((handler) => handler(this));

      const onMove = (e: MouseEvent) => {
        this.svgElement.style.left = `${startRect.left + e.clientX - draggingState.startMouseX}px`;
        this.svgElement.style.top = `${startRect.top + e.clientY - draggingState.startMouseY}px`;
      };
      document.addEventListener("mousemove", onMove);

      const onUp = (e: MouseEvent) => {
        this.svgElement.style.left = `${startRect.left}px`;
        this.svgElement.style.top = `${startRect.top}px`;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        handle.svgElement.style.cursor = "grab";
        game.dragEndListeners.forEach((handler) => handler(this));
        for (const [shape, handler] of game.dropListeners) {
          const bBox = shape.svgElement.getBoundingClientRect();
          if (
            e.clientX >= bBox.x &&
            e.clientX <= bBox.x + bBox.width &&
            e.clientY >= bBox.y &&
            e.clientY <= bBox.y + bBox.height
          ) {
            handler(this);
            break;
          }
        }
      };
      document.addEventListener("mouseup", onUp);
    });
  }

  get(name: string): EngineShape {
    return new EngineShape(getSvgElementByLabel(this.svgElement, name));
  }
}

globalThis.game = new Game();
globalThis.place = makeNotPresentObject(
  "you cannot access 'place' in the current context. It is only valid in .ts files belonging to places",
);
globalThis.item = makeNotPresentObject(
  "you cannot access 'item' in the current context. It is only valid in .ts files belonging to items",
);
