import { Game } from "./game";
import { makeNotPresentObject } from "./util/not-present";

globalThis.game = new Game();
globalThis.place = makeNotPresentObject(
  "you cannot access 'place' in the current context. It is only valid in .ts files belonging to places",
);
globalThis.item = makeNotPresentObject(
  "you cannot access 'item' in the current context. It is only valid in .ts files belonging to items",
);
globalThis.control = makeNotPresentObject(
  "you cannot access 'control' in the current context. It is only valid in .ts files belonging to controls",
);
