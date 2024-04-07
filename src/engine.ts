import { loadSvg, loadTs } from "./loader";
import { makePersistedObject, PersistedObject } from "./persisted-object";
import { getSvgElementByLabel, getSvgViewBox } from "./svg-utils";

export class Game {
  currentPlace?: Place;
  state: PersistedObject<GameState>;

  constructor() {
    globalThis.game = this;

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

    const svg = await loadSvg(`places/${place}.svg`);
    if (svg) {
      const pageContainer = document.getElementById("page");
      pageContainer?.replaceChildren(svg);
      this.currentPlace = new Place(svg);
    }
    await loadTs(`places/${place}.ts`);
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

  getPlace(): Place {
    if (!this.currentPlace) throw Error("current place is undefined");
    return this.currentPlace;
  }

  getScale(): number {
    const { width, height } =
      this.getPlace().svgElement.getBoundingClientRect();
    const viewBox = getSvgViewBox(this.getPlace().svgElement);
    const scaleX = width / viewBox.width;
    const scaleY = height / viewBox.height;
    return Math.min(scaleX, scaleY);
  }

  get(name: string) {
    return this.getPlace().get(name);
  }
}

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
  hide(): this {
    this.svgElement.style.opacity = "0";
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

    const scale = game.getScale();
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
    const startRect = this.svgElement.getBoundingClientRect();
    handle.svgElement.addEventListener("mousedown", (e) => {
      draggingState.startMouseX = e.clientX;
      draggingState.startMouseY = e.clientY;
      handle.svgElement.style.cursor = "grabbing";

      const onMove = (e: MouseEvent) => {
        this.svgElement.style.left = `${startRect.left + e.clientX - draggingState.startMouseX}px`;
        this.svgElement.style.top = `${startRect.top + e.clientY - draggingState.startMouseY}px`;
      };
      document.addEventListener("mousemove", onMove);

      const onUp = () => {
        this.svgElement.style.left = `${startRect.left}px`;
        this.svgElement.style.top = `${startRect.top}px`;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        handle.svgElement.style.cursor = "grab";
      };
      document.addEventListener("mouseup", onUp);
    });
  }

  get(name: string): EngineShape {
    return new EngineShape(getSvgElementByLabel(this.svgElement, name));
  }
}

new Game();
