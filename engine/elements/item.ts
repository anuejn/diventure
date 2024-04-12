import { EngineShape } from "./engine-shape";
import { GameElement } from "./element";
import { loadSvg, loadTs } from "../util/loader";

export class Item extends GameElement {
  static async loadItem(itemName: string, id: string) {
    const svg = await loadSvg(`items/${itemName}.svg`);
    if (!svg) throw Error(`an item '${itemName}' does not exist`);

    const item = new Item(svg, {
      kind: "item",
      id: id,
    });
    item.addStyles({
      transitionProperty: "width, height",
      transitionDuration: "0.5s",
      transform: "translate(-50%, -50%)",
    });

    await loadTs(`items/${itemName}.ts`, { item });
    return item;
  }

  anchor(at: EngineShape, placementOptions: Partial<AnchorOptions> = {}): Item {
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

    type Pos = { x: number; y: number };

    const getElementPos = (elem: Element): Pos => {
      const compStyle = window.getComputedStyle(elem);
      return {
        x: parseFloat(compStyle.left.replace("px", "")),
        y: parseFloat(compStyle.top.replace("px", "")),
      };
    };
    const getMousePos = (e: MouseEvent | TouchEvent): Pos => {
      if ("clientX" in e) {
        return { x: e.clientX, y: e.clientY };
      } else {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    let startMousePos = { x: 0, y: 0 };
    let startElementPos = getElementPos(this.svgElement);

    const onDown = (e: MouseEvent | TouchEvent) => {
      startElementPos = getElementPos(this.svgElement);
      startMousePos = getMousePos(e);
      handle.svgElement.style.cursor = "grabbing";
      const initialAnchor = JSON.parse(
        JSON.stringify(game.state.anchoredItems[this.path.id]),
      );
      delete game.state.anchoredItems[this.path.id];
      game.dragStartListeners.forEach((handler) => handler(this));

      const onMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const mousePos = getMousePos(e);
        this.svgElement.style.left = `${startElementPos.x + mousePos.x - startMousePos.x}px`;
        this.svgElement.style.top = `${startElementPos.y + mousePos.y - startMousePos.y}px`;
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("touchmove", onMove, { passive: false });

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchend", onUp);
        document.removeEventListener("touchcancel", onUp);
        handle.svgElement.style.cursor = "grab";
        game.dragEndListeners.forEach((handler) => handler(this));

        let handled = false;
        for (const [shape, handler] of game.dropListeners) {
          const bBox = shape.svgElement.getBoundingClientRect();
          if (
            game.clientX >= bBox.x &&
            game.clientX <= bBox.x + bBox.width &&
            game.clientY >= bBox.y &&
            game.clientY <= bBox.y + bBox.height
          ) {
            handled = !!handler(this);
            if (handled) break;
          }
        }
        if (!handled) {
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
}
