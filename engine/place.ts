import { EngineShape } from "./engine-shape";
import {
  getSvgElementByLabel,
  getSvgElementsByLabelPattern,
  getSvgViewBox,
} from "./util/svg-utils";

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
