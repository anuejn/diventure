import { loadSvg, loadTs } from "./util/loader";
import { makePersistedObject, PersistedObject } from "./util/persisted-object";
import { Item } from "./item";
import { Place } from "./place";
import { EngineShape } from "./engine-shape";

export type DnDHandler = (item: Item) => void;

export class Game {
  currentPlace?: Place;
  state: PersistedObject<GameState>;

  dragStartListeners: DnDHandler[] = [];
  dragEndListeners: DnDHandler[] = [];
  dropListeners: [EngineShape, DnDHandler][] = [];

  constructor() {
    this.state = makePersistedObject("game_state", {
      currentPlace: "__start__",
      itemStates: {},
    });
    this.state.subscribeChild("currentPlace", async (place, oldPlace) => {
      if (place == oldPlace) return;
      this.navigate(place);
    });
  }

  reset() {
    window.localStorage.removeItem("game_state");
    window.location.reload();
  }

  async navigate(place: string): Promise<void> {
    console.log(`loading place: ${place}`);
    this.state.currentPlace = place;
    const pageContainer = document.getElementById("page");
    if (!pageContainer) throw Error("page container is gone");

    pageContainer.style.transition = "";
    pageContainer.style.opacity = "0";

    const svg = await loadSvg(`places/${place}.svg`);
    if (svg) {
      pageContainer.replaceChildren(svg);
      this.currentPlace = new Place(svg);
    }
    await loadTs(`places/${place}.ts`, { place: this.currentPlace });

    // TODO: only do this after we are really done loading the next page
    pageContainer.style.transition = "opacity 0.5s";
    pageContainer.style.opacity = "1";
  }

  async loadItem(item: string, name = "0") {
    const svgElement = await loadSvg(`items/${item}.svg`);
    if (!svgElement) {
      throw Error(`item named '${item}' does not exist`);
    }
    const compiledName = `${item}_${name}`;
    if (!(name in game.state.itemStates)) {
      game.state.itemStates[compiledName] = {};
    }
    return new Item(compiledName, svgElement);
  }

  getCurrentPlace(): Place {
    if (!this.currentPlace) throw Error("current place is undefined");
    return this.currentPlace;
  }
}
