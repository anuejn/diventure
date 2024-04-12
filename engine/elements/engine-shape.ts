import { DnDHandler, DropHandler } from "../game";
import { isPointInSvgElement } from "../util/svg-utils";

export class EngineShape {
  svgElement: SVGElement;
  path: Path;

  constructor(svgElement: SVGElement, path: Path) {
    this.svgElement = svgElement;
    this.path = path;
  }

  onClick(handler: () => void): this {
    this.svgElement.style.cursor = "pointer";
    this.svgElement.addEventListener("click", () => handler());
    return this;
  }
  onMouseOver(handler: () => void): this {
    this.svgElement.addEventListener("mouseover", () => handler());
    return this;
  }
  onMouseOut(handler: () => void): this {
    const listener = (e: MouseEvent) => {
      if (!isPointInSvgElement(this.svgElement, e.clientX, e.clientY)) {
        handler();
        window.removeEventListener("mousemove", listener);
      } else if (e.type == "mouseout") {
        window.addEventListener("mousemove", listener);
      }
    };
    window.addEventListener("mouseout", listener);
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
  onOtherDrop(handler: DropHandler): this {
    game.dropListeners.push([this, handler]);
    return this;
  }

  hide(): this {
    this.svgElement.style.opacity = "0";
    return this;
  }
  vanish(): this {
    this.hide();
    this.svgElement.style.visibility = "hidden";
    return this;
  }
  show(): this {
    this.svgElement.style.visibility = "visible";
    this.svgElement.style.opacity = "1";
    return this;
  }

  setPulse(should?: boolean) {
    if (should == false) {
      this.svgElement.classList.remove("pulse");
    } else {
      this.svgElement.classList.add("pulse");
    }
  }

  addStyles(css: Partial<CSSStyleDeclaration>) {
    Object.assign(this.svgElement.style, css);
  }
}
