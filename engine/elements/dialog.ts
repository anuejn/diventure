import { EngineShape } from "./engine-shape";

export class Dialog {
  engineShape: EngineShape;
  container: HTMLDivElement;
  innerContainer: HTMLDivElement;
  answerOptionsContainer: HTMLDivElement;

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

    this.answerOptionsContainer = document.createElement("div");
    this.answerOptionsContainer.setAttribute(
      "class",
      "answer-options-container",
    );
    const viewport = document.getElementById("viewport");
    viewport?.appendChild(this.answerOptionsContainer);
    engineShape.onOutOfView(() => {
      this.answerOptionsContainer.remove();
    });
  }

  private async say(text: string, classes = "") {
    const bubble = document.createElement("p");
    bubble.setAttribute("class", `speech-bubble ${classes}`);
    bubble.innerHTML = text;
    bubble.style.opacity = "0";
    this.innerContainer.appendChild(bubble);
    this.innerContainer.scrollTo({ top: 1e9, behavior: "smooth" });
    setTimeout(() => {
      bubble.style.opacity = "1";
    }, 100);
    await sleep(1000);
  }

  async sayRight(text: string) {
    await this.say(text, "right");
  }

  async sayLeft(text: string) {
    await this.say(text, "left");
  }

  async blank() {
    await this.say("", "blank");
  }

  async answerOptions(options: AnswerOptions, side = "left") {
    return new Promise((resolve) => {
      for (const [text, callback] of Object.entries(options)) {
        const bubble = document.createElement("div");
        bubble.setAttribute("class", "speech-bubble");
        bubble.style.cursor = "pointer";
        bubble.innerHTML = text;
        bubble.addEventListener(
          "click",
          async () => {
            this.answerOptionsContainer.replaceChildren();
            await this.say(text, side);
            resolve(callback());
          },
          { once: true },
        );
        this.answerOptionsContainer.appendChild(bubble);
      }
    });
  }
}
