import { makePersistedObject, PersistedObject } from "./persisted-object";
import { loadSvg } from "./svgLoader";
import { loadTs } from "./tsLoader";

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
    this.currentPage = null as unknown as SVGAElement; // this is fine because navigate will set it
    Object.keys(this.state)
      .filter((k) => k != "currentPlace")
      .forEach((k) => {
        delete this.state[k as keyof GameState];
      });
    this.navigate("__start__");
  }

  async navigate(place: string): Promise<void> {
    console.log(`loading place: ${place}`);
    this.state.currentPlace = place;

    game.currentPage = await loadSvg(`places/${place}.svg`);
    await loadTs(`places/${place}.ts`);

    const pageContainer = document.getElementById("page");
    pageContainer?.replaceChildren(game.currentPage);
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
