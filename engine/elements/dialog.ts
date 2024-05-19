import { EngineShape } from "./engine-shape";

export class Dialog {
  engineShape: EngineShape;
  container: HTMLDivElement;

  constructor(engineShape: EngineShape) {
    this.engineShape = engineShape;
    this.container = document.createElement("div");
    this.container.setAttribute("class", "dialog-container");
    game.anchoredElements.push([
      this.container,
      { location: this.engineShape.path, options: { size: "fill" } },
    ]);
    game.relayoutAnchors();
  }

  private say(text: string, classes = "") {
    this.container.innerHTML += `<p class="speech-bubble ${classes}">${text}</p>`;
  }

  sayRight(text: string) {
    this.say(text, "right");
  }

  sayLeft(text: string) {
    this.say(text, "left");
  }
}
