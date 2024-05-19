import { EngineShape } from "./engine-shape";

export class Dialog {
  engineShape: EngineShape;
  container: HTMLDivElement;
  innerContainer: HTMLDivElement;

  constructor(engineShape: EngineShape) {
    this.engineShape = engineShape;
    this.container = document.createElement("div");

    const middleContainer = document.createElement("div");
    middleContainer.setAttribute("class", "dialog-container-middle");
    middleContainer.innerHTML = `<div class="dialog-container-shadow"></div>`;
    this.container.appendChild(middleContainer);

    this.innerContainer = document.createElement("div");
    this.innerContainer.setAttribute("class", "dialog-container-inner");
    middleContainer.appendChild(this.innerContainer);

    const anchorElement = [
      this.container,
      { location: this.engineShape.path, options: { size: "fill" } },
    ] as [HTMLDivElement, AnchorPlacement];

    game.anchoredElements.push(anchorElement);
    game.relayoutAnchors();

    engineShape.onOutOfView(() => {
      const index = game.anchoredElements.findIndex((v) => v == anchorElement);
      console.log("index");
      if (index != -1) game.anchoredElements.splice(index, 1);
      this.container.remove();
    });
  }

  private say(text: string, classes = "") {
    const bubble = document.createElement("p");
    bubble.setAttribute("class", `speech-bubble ${classes}`);
    bubble.innerText = text;
    bubble.style.opacity = "0";
    this.innerContainer.appendChild(bubble);
    this.innerContainer.scrollTo({ top: 1e9, behavior: "smooth" });
    setTimeout(() => {
      bubble.style.opacity = "1";
    }, 100);
  }

  sayRight(text: string) {
    this.say(text, "right");
  }

  sayLeft(text: string) {
    this.say(text, "left");
  }
}
