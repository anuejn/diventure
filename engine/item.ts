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

    const getXY = (e: MouseEvent | TouchEvent): [number, number] => {
      if ("clientX" in e) {
        return [e.clientX, e.clientY];
      } else {
        return [e.touches[0].clientX, e.touches[0].clientY];
      }
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      startRect = this.svgElement.getBoundingClientRect();
      let xy = getXY(e);
      [draggingState.startMouseX, draggingState.startMouseY] = xy;
      handle.svgElement.style.cursor = "grabbing";
      game.dragStartListeners.forEach((handler) => handler(this));

      const onMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        xy = getXY(e);
        this.svgElement.style.left = `${startRect.left + xy[0] - draggingState.startMouseX}px`;
        this.svgElement.style.top = `${startRect.top + xy[1] - draggingState.startMouseY}px`;
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("touchmove", onMove, { passive: false });

      const onUp = () => {
        this.svgElement.style.left = `${startRect.left}px`;
        this.svgElement.style.top = `${startRect.top}px`;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchend", onUp);
        document.removeEventListener("touchcancel", onUp);
        handle.svgElement.style.cursor = "grab";
        game.dragEndListeners.forEach((handler) => handler(this));

        for (const [shape, handler] of game.dropListeners) {
          const bBox = shape.svgElement.getBoundingClientRect();
          if (
            xy[0] >= bBox.x &&
            xy[0] <= bBox.x + bBox.width &&
            xy[1] >= bBox.y &&
            xy[1] <= bBox.y + bBox.height
          ) {
            handler(this);
            break;
          }
        }
      };
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchend", onUp);
      document.addEventListener("touchcancel", onUp);
    };
    handle.svgElement.addEventListener("mousedown", onDown);
    handle.svgElement.addEventListener("touchstart", onDown);
  }

  get(name: string): EngineShape {
    return new EngineShape(getSvgElementByLabel(this.svgElement, name));
  }
}
