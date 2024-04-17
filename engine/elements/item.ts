import { EngineShape } from "./engine-shape";
import { GameElement } from "./element";
import { loadSvg, loadTs } from "../util/loader";
import { XY } from "../game";

export class Item extends GameElement {
  itemName: string;

  static async loadItem(itemName: string, id: string) {
    const svg = await loadSvg(`items/${itemName}.svg`);
    if (!svg) throw Error(`an item '${itemName}' does not exist`);

    const item = new Item(svg, itemName, id);
    item.addStyles({
      transitionProperty: "width, height",
      transitionDuration: "0.1s",
      transform: "translate(-50%, -50%)",
    });

    await loadTs(`items/${itemName}.ts`, { item });
    return item;
  }

  private constructor(svgElement: SVGElement, itemName: string, id: string) {
    super(svgElement, {
      kind: "item",
      id: id,
    });
    this.itemName = itemName;
  }

  anchor(at: EngineShape, placementOptions: Partial<AnchorOptions> = {}): Item {
    if (this.isDestroyed()) throw Error("tried to anchor a destroyed item");

    const options: AnchorOptions = { size: "real", ...placementOptions };

    game.state.anchoredItems[this.path.id] = {
      location: at.path,
      options,
    };
    return this;
  }
  isAnchored(): boolean {
    return this.path.id in game.state.anchoredItems;
  }
  getAnchorParent(): GameElement | undefined {
    if (!this.isAnchored())
      throw Error(`the item ${this.path.id} is not anchored`);
    const placement = game.state.anchoredItems[this.path.id];
    if (placement.location.kind == "control") {
      return game.controls[placement.location.id];
    } else if (placement.location.kind == "place") {
      if (game.getCurrentPlace().path.id != placement.location.id)
        return undefined;
      return game.getCurrentPlace();
    } else {
      throw Error(
        `anchoring to elements of kind '${placement.location.kind}' is currently not supported'`,
      );
    }
  }
  getAnchorShape(): EngineShape | undefined {
    if (!this.isAnchored())
      throw Error(`the item ${this.path.id} is not anchored`);
    const placement = game.state.anchoredItems[this.path.id];
    const parent = this.getAnchorParent();
    if (!placement.location.label)
      throw Error("cannot anchor at undefined label");
    return parent?.get(placement.location.label);
  }

  draggable(handleLabel: string): this {
    const handle = this.get(handleLabel);
    handle.svgElement.style.cursor = "grab";

    const getMousePos = (e: MouseEvent | TouchEvent): XY => {
      if ("clientX" in e) {
        return { x: e.clientX, y: e.clientY };
      } else {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      handle.svgElement.style.cursor = "grabbing";
      const initialAnchor = JSON.parse(
        JSON.stringify(game.state.anchoredItems[this.path.id]),
      );
      delete game.state.anchoredItems[this.path.id];

      const onMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const mousePos = getMousePos(e);
        this.svgElement.style.left = `${mousePos.x}px`;
        this.svgElement.style.top = `${mousePos.y}px`;
      };
      onMove(e);
      document.addEventListener("mousemove", onMove);
      document.addEventListener("touchmove", onMove, { passive: false });

      game.dragStartListeners.forEach((handler) => handler(this));

      const onUp = async () => {
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
            game.mousePos.x >= bBox.x &&
            game.mousePos.x <= bBox.x + bBox.width &&
            game.mousePos.y >= bBox.y &&
            game.mousePos.y <= bBox.y + bBox.height
          ) {
            handler(this);
            if (this.isAnchored() || this.isDestroyed()) break;
          }
        }
        if (!(this.isAnchored() || this.isDestroyed())) {
          game.state.anchoredItems[this.path.id] = initialAnchor;
        }
      };
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchend", onUp);
      document.addEventListener("touchcancel", onUp);
    };
    handle.svgElement.addEventListener("mousedown", onDown);
    handle.svgElement.addEventListener("touchstart", onDown);

    return this;
  }

  isDestroyed(): boolean {
    return game.items[this.path.id] == undefined;
  }

  destroy() {
    if (this.isAnchored()) {
      delete game.state.anchoredItems[this.path.id];
    }
    delete game.items[this.path.id];

    const viewport = document.getElementById("viewport");
    if (!viewport) throw Error("viewport container is gone");
    if (viewport.contains(this.svgElement)) {
      viewport.removeChild(this.svgElement);
    }
  }
}
