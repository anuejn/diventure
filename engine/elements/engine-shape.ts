import { DnDHandler } from "../game";
import { isPointInSvgElement } from "../util/svg-utils";
import { Dialog } from "./dialog";
import { Item } from "./item";

export class EngineShape {
  svgElement: SVGElement;
  path: Path;
  hasClickListener = false;

  constructor(svgElement: SVGElement, path: Path) {
    this.svgElement = svgElement;
    this.path = path;
  }

  onClick(handler: () => void): this {
    this.svgElement.style.cursor = "pointer";
    this.hasClickListener = true;
    this.svgElement.addEventListener("click", () => handler());
    return this;
  }
  waitClick(): Promise<void> {
    this.svgElement.style.cursor = "pointer";
    return new Promise((resolve) => {
      this.svgElement.addEventListener(
        "click",
        () => {
          resolve();
          if (!this.hasClickListener) {
            this.svgElement.style.cursor = "auto";
          }
        },
        { once: true },
      );
    });
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
  onOtherDrop(handler: DnDHandler): this {
    game.dropListeners.push([this, handler]);
    return this;
  }

  waitOtherDrop(filter: (item: Item) => boolean): Promise<Item> {
    return new Promise((resolve) => {
      const handler = (item: Item) => {
        if (filter(item)) {
          game.dropListeners.splice(index, 1);
          resolve(item);
        }
      };
      const index = game.dropListeners.push([this, handler]) - 1;
    });
  }

  /// called when the shape gets out of sight
  onOutOfView(callback: () => void): this {
    if (this.path.kind == "place") {
      const place = game.places[this.path.id];
      if (place) {
        place.onLeave(callback);
      } else {
        callback();
      }
    } else {
      throw Error(
        `onLeave is not implemented for shapes that are part of an ${this.path.kind}`,
      );
    }

    return this;
  }

  hide(): this {
    this.svgElement.style.opacity = "0";
    this.svgElement.style.visibility = "hidden";
    return this;
  }
  show(doShow?: boolean): this {
    if (doShow || doShow == undefined) {
      this.svgElement.style.visibility = "visible";
      this.svgElement.style.opacity = "1";
    } else {
      this.hide();
    }
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

  anchoredItems(): Item[] {
    const toReturn = [];
    for (const [id, anchor] of Object.entries(game.state.anchoredItems)) {
      if (JSON.stringify(anchor.location) == JSON.stringify(this.path)) {
        toReturn.push(game.items[id]);
      }
    }
    return toReturn;
  }

  dialog(shape: EngineShape): Dialog {
    return new Dialog(shape);
  }
}
