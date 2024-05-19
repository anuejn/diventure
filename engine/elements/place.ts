import { loadSvg, loadTs } from "../util/loader";
import { GameElement } from "./element";

type LeaveCallback = () => void;

export class Place extends GameElement {
  leaveCallbacks: LeaveCallback[] = [];

  static async loadPlace(placeName: string) {
    const svg =
      (await loadSvg(`places/${placeName}.svg`)) ||
      document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const place = new Place(svg, {
      kind: "place",
      id: placeName,
    });
    game.places[placeName] = place;
    place.onLeave(() => {
      delete game.places[placeName];
    });
    await loadTs(`places/${placeName}.ts`, { place: place });
    return place;
  }

  onLeave(leaveCallback: () => void) {
    this.leaveCallbacks.push(leaveCallback);
  }
}
