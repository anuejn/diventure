import { instance } from "@viz-js/viz";
import { load, places } from "./loader";
import { makePersistedObject } from "./persisted-object";
import { Game } from "./engine";

window.game = {} as Game;
game.state = makePersistedObject("game_state", {
  currentPlace: "__start__",
});

game.state.subscribe((state) => {
  const stateContainer = document.getElementById("state");
  if (stateContainer) {
    stateContainer.innerText = JSON.stringify(state, null, 4);
  }
});
game.state.subscribeChild("currentPlace", (currentPlace) => {
  instance().then(async (viz) => {
    let connections = "";
    for (const place of await places()) {
      connections += `"${place}" [id="${place}"${place == currentPlace ? ', color="red"' : ""}]\n`;
      const content = await load(`places/${place}.ts`);
      const matches = (content || "").matchAll(/navigate\((.*)\)/g);
      for (const match of matches) {
        const param = match[1].replace(/["']/g, "");
        connections += `"${place}" -> "${param}"\n`;
      }
    }

    const svg = viz.renderSVGElement(`digraph { rankdir="LR" ${connections} }`);

    document.getElementById("graph")?.replaceChildren(svg);

    for (const node of document.getElementsByClassName("node")) {
      node.addEventListener("click", () => {
        game.state.currentPlace = node.id;
      });
    }
  });
});
