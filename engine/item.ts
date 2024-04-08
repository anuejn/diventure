import { EngineShape } from "./engine-shape";
import { getSvgElementByLabel, getSvgViewBox } from "./util/svg-utils";

export class Item {
  state: unknown;
  svgElement: SVGElement;

  constructor(name: string, svgElement: SVGElement) {
    this.state = game.state.itemStates[name];
    this.svgElement = svgElement;
  }

  place(at: EngineShape): Item {
    const pageContainer = document.getElementById("page");
    if (!pageContainer) throw Error("page container is gone");

    const scale = game.getCurrentPlace().svgScale();
    const viewBox = getSvgViewBox(this.svgElement);
    const width = viewBox.width * scale;
    const height = viewBox.height * scale;
    this.svgElement.style.width = `${width}px`;
    this.svgElement.style.height = `${height}px`;

    const atRect = at.svgElement.getBoundingClientRect();

    this.svgElement.style.position = "absolute";
    this.svgElement.style.left = `${atRect.left + (atRect.width - width) / 2}px`;
    this.svgElement.style.top = `${atRect.top + (atRect.height - height) / 2}px`;

    pageContainer.appendChild(this.svgElement);

    return this;
  }

  draggable(handleLabel: string) {
    const handle = this.get(handleLabel);
    handle.svgElement.style.cursor = "grab";

    const draggingState = { startMouseX: 0, startMouseY: 0 };
    let startRect = this.svgElement.getBoundingClientRect();
    handle.svgElement.addEventListener("mousedown", (e) => {
      startRect = this.svgElement.getBoundingClientRect();
      draggingState.startMouseX = e.clientX;
      draggingState.startMouseY = e.clientY;
      handle.svgElement.style.cursor = "grabbing";
      game.dragStartListeners.forEach((handler) => handler(this));

      const onMove = (e: MouseEvent) => {
        this.svgElement.style.left = `${startRect.left + e.clientX - draggingState.startMouseX}px`;
        this.svgElement.style.top = `${startRect.top + e.clientY - draggingState.startMouseY}px`;
      };
      document.addEventListener("mousemove", onMove);

      const onUp = (e: MouseEvent) => {
        this.svgElement.style.left = `${startRect.left}px`;
        this.svgElement.style.top = `${startRect.top}px`;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        handle.svgElement.style.cursor = "grab";
        game.dragEndListeners.forEach((handler) => handler(this));
        for (const [shape, handler] of game.dropListeners) {
          const bBox = shape.svgElement.getBoundingClientRect();
          if (
            e.clientX >= bBox.x &&
            e.clientX <= bBox.x + bBox.width &&
            e.clientY >= bBox.y &&
            e.clientY <= bBox.y + bBox.height
          ) {
            handler(this);
            break;
          }
        }
      };
      document.addEventListener("mouseup", onUp);
    });
  }

  get(name: string): EngineShape {
    return new EngineShape(getSvgElementByLabel(this.svgElement, name));
  }
}
