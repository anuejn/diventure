import { loadSvg, loadTs } from "./loader";
import { makePersistedObject, PersistedObject } from "./persisted-object";

export class Game {
  currentPage: SVGElement;
  state: PersistedObject<GameState>;

  constructor() {
    globalThis.game = this;

    this.currentPage = null as unknown as SVGAElement; // this is fine because navigate will set it

    this.state = makePersistedObject("game_state", {
      currentPlace: "__start__",
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
      this.currentPage = svg;
    }
    await loadTs(`places/${place}.ts`);
  }

  get(name: string): EngineShape {
    const elements = this.currentPage.getElementsByTagName(
      "*",
    ) as HTMLCollectionOf<SVGElement>;
    for (const element of elements) {
      if (element.getAttribute("inkscape:label") == name) {
        return new EngineShape(element);
      }
    }
    throw Error(`can't find object with named '${name}' on this place`);
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

new Game();
