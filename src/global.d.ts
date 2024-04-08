/* eslint-disable no-var */
import { Game, Place } from "./engine";

export {};

declare global {
  var game: Game;

  var place: Place;
  var item: Item;
}
