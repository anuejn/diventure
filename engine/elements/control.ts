import { loadSvg, loadTs } from "../util/loader";
import { GameElement } from "./element";

export class Control extends GameElement {
  static async loadControl(controlName: string) {
    const svg = await loadSvg(`controls/${controlName}.svg`);
    if (!svg) throw Error(`control '${controlName}' is missing an svg`);
    const control = new Control(svg, {
      kind: "control",
      id: controlName,
    });
    await loadTs(`controls/${controlName}.ts`, { control });
    return control;
  }

  anchor(x: "left" | "right", y: "top" | "bottom") {
    const viewportContainer = document.getElementById("viewport");
    if (!viewportContainer) throw Error("page container is gone");

    this.svgElement.style.position = "absolute";
    this.svgElement.style[x] = "0";
    this.svgElement.style[y] = "0";

    viewportContainer.appendChild(this.svgElement);
  }
}
