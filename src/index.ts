import { load } from "./loader";
import hooks from "./hooks";

export class Game {
  currentPage: SVGElement;

  constructor() {
    globalThis.game = this;
    this.currentPage = null as unknown as SVGAElement; // this is fine because navigate will set it
    this.navigate("__start__");
  }

  async navigate(page: string): Promise<void> {
    console.log(`loading page: ${page}`);

    const svg = (await load(`${page}.svg`)) || "<svg></svg>";
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");
    game.currentPage = svgDoc.children[0] as SVGElement;

    hooks.forEach((hook) => hook());

    const ts = await load(`${page}.ts`);
    if (ts) {
      // TODO: add typescript type stripping
      eval(ts);
    }

    const root = document.getElementById("root");
    root?.replaceChildren(game.currentPage);
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
    throw Error(`can't find object with named '${name}' on this page`);
  }
}

export class EngineShape {
  svgElement: SVGElement;

  constructor(svgElement: SVGElement) {
    this.svgElement = svgElement;
  }

  onClick(handler: () => void) {
    this.svgElement.style.cursor = "pointer";
    this.svgElement.addEventListener("click", () => handler());
  }
}

new Game();
