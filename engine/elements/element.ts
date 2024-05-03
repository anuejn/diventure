import { EngineShape } from "./engine-shape";
import {
  getSvgElementByLabel,
  getSvgElementsByLabelPattern,
} from "../util/svg-utils";

export class GameElement extends EngineShape {
  kind: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;

  // name must be unique
  protected constructor(svgElement: SVGElement, path: Path) {
    super(svgElement, path);
    svgElement.id = path.id;

    if (!(path.id in game.state.elementStates)) {
      game.state.elementStates[path.id] = {};
    }
    this.state = game.state.elementStates[path.id];
  }

  get(label: string): EngineShape {
    return new EngineShape(getSvgElementByLabel(this.svgElement, label), {
      ...this.path,
      label: label,
    });
  }

  getMany(pattern: RegExp): EngineShape[] {
    const svgElements = getSvgElementsByLabelPattern(this.svgElement, pattern);
    if (svgElements.length < 2) {
      console.warn(
        `getMany() matched ${svgElements.length} elements. Maybe you have a typo in your pattern?`,
      );
    }
    return getSvgElementsByLabelPattern(this.svgElement, pattern).map(
      ([x, label]) => new EngineShape(x, { ...this.path, label: label }),
    );
  }
}
