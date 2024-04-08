import { DnDHandler } from "./game";

export class EngineShape {
  svgElement: SVGElement;

  constructor(svgElement: SVGElement) {
    this.svgElement = svgElement;
  }

  onClick(handler: () => void): this {
    this.svgElement.style.cursor = "pointer";
    this.svgElement.addEventListener("click", () => handler());
    return this;
  }

  onOtherDragStart(handler: DnDHandler): this {
    game.dragStartListeners.push(handler);
    return this;
  }

  onOtherDragEnd(handler: DnDHandler): this {
    game.dragEndListeners.push(handler);
    return this;
  }

  onOtherDrop(handler: DnDHandler): this {
    game.dropListeners.push([this, handler]);
    return this;
  }

  hide(): this {
    this.svgElement.style.opacity = "0";
    return this;
  }
  show(): this {
    this.svgElement.style.opacity = "1";
    return this;
  }
}
