import { EngineShape } from "./engine-shape";
import "./dialog.css";

export class Dialog {
  engineShape: EngineShape;
  container: HTMLDivElement;
  innerContainer: HTMLDivElement;
  answerOptionsContainer: HTMLDivElement;
  destroyed = false;
  meSide: "left" | "right";

  constructor(engineShape: EngineShape, meSide: "left" | "right") {
    this.engineShape = engineShape;
    this.meSide = meSide;
    this.container = document.createElement("div");

    const middleContainer = document.createElement("div");
    middleContainer.setAttribute("class", "dialog-container-middle");
    middleContainer.innerHTML = `<div class="dialog-container-shadow"></div>`;
    this.container.appendChild(middleContainer);

    this.innerContainer = document.createElement("div");
    this.innerContainer.setAttribute("class", "dialog-container-inner");
    middleContainer.appendChild(this.innerContainer);

    game.anchoredElements.push([
      this.container,
      { location: this.engineShape.path, options: { size: "fill" } },
    ]);
    void game.relayoutAnchors();

    this.answerOptionsContainer = document.createElement("div");
    this.answerOptionsContainer.setAttribute(
      "class",
      "answer-options-container",
    );
    const viewport = document.getElementById("viewport");
    viewport?.appendChild(this.answerOptionsContainer);
    engineShape.onOutOfView(() => {
      void this.destroy(0);
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
    await sleep(750 + text.split(" ").length * 150);
  }

  async sayMe(text: string) {
    await this.say(text, this.meSide);
  }

  async sayOther(text: string) {
    await this.say(text, this.meSide == "left" ? "right" : "left");
  }

  async blank() {
    await this.say("", "blank");
  }

  async answerOptions(options: AnswerOptions) {
    return new Promise((resolve) => {
      this.answerOptionsContainer.replaceChildren();
      for (const [text, callback] of Object.entries(options)) {
        const bubble = document.createElement("div");
        bubble.setAttribute("class", "speech-bubble");
        bubble.style.cursor = "pointer";
        bubble.innerHTML = text;
        bubble.addEventListener(
          "click",
          async () => {
            this.answerOptionsContainer.replaceChildren();
            await this.sayMe(text);
            resolve(callback());
          },
          { once: true },
        );
        this.answerOptionsContainer.appendChild(bubble);
      }
    });
  }

  async answerOptionsLoop(options: AnswerOptions) {
    const processedOptions = Object.fromEntries(
      Object.entries(options).map(([text, callback]) => [
        text,
        async () => {
          await callback();
          delete processedOptions[text];
        },
      ]),
    );

    while (!this.destroyed && Object.keys(processedOptions).length > 0) {
      await this.answerOptions(processedOptions);
    }
  }

  async destroy(time = 1000) {
    this.answerOptionsContainer.style.opacity = "0";
    this.innerContainer.style.opacity = "0";
    await sleep(time);
    this.answerOptionsContainer.remove();
    const index = game.anchoredElements.findIndex(
      ([element]) => element == this.container,
    );
    if (index != -1) game.anchoredElements.splice(index, 1);
    this.container.remove();
    this.destroyed = true;
  }
}
