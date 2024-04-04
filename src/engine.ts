import { load } from "./loader";
import hooks from "./hooks";
import { makePersistedObject, PersistedObject } from "./persisted-object";

export class Game {
  currentPage: SVGElement;
  state: PersistedObject<GameState>;
  pageLoading: boolean;

  constructor() {
    globalThis.game = this;

    this.currentPage = null as unknown as SVGAElement; // this is fine because navigate will set it
    this.pageLoading = false;

    this.state = makePersistedObject("game_state", {
      currentPlace: "__start__",
    });
    this.state.subscribeChild("currentPlace", async (place) => {
      this.navigate(place);
    });
  }

  reset() {
    this.currentPage = null as unknown as SVGAElement; // this is fine because navigate will set it
    localStorage.removeItem("game_state");

    this.state = makePersistedObject("game_state", {
      currentPlace: undefined as unknown as string,
    });
    this.state.subscribeChild("currentPlace", async (place) => {
      this.navigate(place);
    });
  }

  async navigate(place: string): Promise<void> {
    if (this.pageLoading) return;
    this.pageLoading = true;
    console.log(`loading place: ${place}`);
    this.state.currentPlace = place;

    const svg = (await load(`places/${place}.svg`)) || "<svg></svg>";
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");
    game.currentPage = svgDoc.children[0] as SVGElement;

    hooks.forEach((hook) => hook());

    const ts = await load(`places/${place}.ts`);
    if (ts) {
      // TODO: add typescript type stripping
      eval(ts);
    }

    const pageContainer = document.getElementById("page");
    pageContainer?.replaceChildren(game.currentPage);
    this.pageLoading = false;
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
