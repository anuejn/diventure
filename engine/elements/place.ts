import { loadSvg, loadTs } from "../util/loader";
import { GameElement } from "./element";

export class Place extends GameElement {
  static async loadPlace(placeName: string) {
    const svg =
      (await loadSvg(`places/${placeName}.svg`)) ||
      document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const place = new Place(svg, {
      kind: "place",
      id: placeName,
    });
    await loadTs(`places/${placeName}.ts`, { place: place });
    return place;
  }
}
