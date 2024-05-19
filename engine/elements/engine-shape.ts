import { DnDHandler } from "../game";
import { isPointInSvgElement, makePointerEvents } from "../util/svg-utils";
import { Dialog } from "./dialog";
import { Item } from "./item";

export class EngineShape {
  svgElement: SVGElement;
  path: Path;
  private hasClickListener = false;

  constructor(svgElement: SVGElement, path: Path) {
    this.svgElement = svgElement;
    this.path = path;
  }

  onClick(handler: () => void): this {
    this.svgElement.style.cursor = "pointer";
    makePointerEvents(this.svgElement, "auto");
    this.svgElement.style.pointerEvents = "auto";
    this.hasClickListener = true;
    this.svgElement.addEventListener("click", () => handler());
    return this;
  }
  waitClick(): Promise<void> {
    this.svgElement.style.cursor = "pointer";
    makePointerEvents(this.svgElement, "auto");
    return new Promise((resolve) => {
      this.svgElement.addEventListener(
        "click",
        () => {
          resolve();
          if (!this.hasClickListener) {
            this.svgElement.style.cursor = "auto";
            makePointerEvents(this.svgElement, "none");
          }
        },
        { once: true },
      );
    });
  }
  onMouseOver(handler: () => void): this {
    makePointerEvents(this.svgElement, "auto");
    this.svgElement.addEventListener("mouseover", () => handler());
    return this;
  }
  onMouseOut(handler: () => void): this {
    makePointerEvents(this.svgElement, "auto");
    const listener = (e: MouseEvent | TouchEvent) => {
      if (
        !isPointInSvgElement(this.svgElement, game.mousePos.x, game.mousePos.y)
      ) {
        handler();
        window.removeEventListener("mousemove", listener);
        window.removeEventListener("touchmove", listener);
      } else if (e.type == "mouseout") {
        window.addEventListener("mousemove", listener);
      }
    };
    window.addEventListener("mouseout", listener);
    window.addEventListener("touchmove", listener);

    return this;
  }

  onOtherDragStart(handler: DnDHandler): this {
    makePointerEvents(this.svgElement, "auto");
    game.dragStartListeners.push(handler);
    return this;
  }
  onOtherDragEnd(handler: DnDHandler): this {
    game.dragEndListeners.push(handler);
    return this;
  }
  onOtherDrop(handler: DnDHandler): this {
    makePointerEvents(this.svgElement, "auto");
    game.dropListeners.push([this, handler]);
    return this;
  }

  waitOtherDrop(filter: (item: Item) => boolean): Promise<Item> {
    makePointerEvents(this.svgElement, "auto");
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

  async anchoredItems(): Promise<Item[]> {
    const toReturn = [];
    for (const [id, anchor] of Object.entries(game.state.anchoredItems)) {
      if (JSON.stringify(anchor.location) == JSON.stringify(this.path)) {
        toReturn.push(await game.getItemById(id));
      }
    }
    return toReturn;
  }

  async anchoredItemsRecursive(): Promise<Item[]> {
    const toReturn = await this.anchoredItems();
    const elements = this.svgElement.getElementsByTagName(
      "*",
    ) as HTMLCollectionOf<SVGElement>;
    for (const element of elements) {
      const label = element.getAttribute("inkscape:label");
      for (const [id, anchor] of Object.entries(game.state.anchoredItems)) {
        if (
          JSON.stringify(anchor.location) ==
          JSON.stringify({ ...this.path, label })
        ) {
          toReturn.push(await game.getItemById(id));
        }
      }
    }
    return toReturn;
  }

  dialog(): Dialog {
    return new Dialog(this);
  }
}
