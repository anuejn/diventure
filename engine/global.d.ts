/* eslint-disable no-var */
import { Game } from "./game";
import { Place } from "./elements/place";
import { Item } from "./elements/item";
import { Control } from "./elements/control";

export {};

declare global {
  var game: Game;

  var place: Place;
  var item: Item;
  var control: Control;

  var sleep: (milliseconds: number) => Promise<void>;
}
