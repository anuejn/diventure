/* eslint-disable no-var */
import { Game } from "./game";
import { Place } from "./place";
import { Item } from "./item";

export {};

declare global {
  var game: Game;

  var place: Place;
  var item: Item;
}
