import { instance } from "@viz-js/viz";
import { load, pages } from "./loader";
import { makePersistedObject } from "./persisted-object";
import { Game } from "./engine";

window.game = {} as Game;
game.state = makePersistedObject("game_state", {
  currentPage: "__start__",
});

game.state.on(() => {
  updateGraph();
  updateStatePre();
});

function updateStatePre() {
  const stateContainer = document.getElementById("state");
  if (stateContainer) {
    stateContainer.innerText = JSON.stringify(game.state, null, 4);
  }
}

async function updateGraph() {
  instance().then(async (viz) => {
    let connections = "";
    for (const page of await pages()) {
      connections += `"${page}" [id="${page}"${game.state.currentPage == page ? ', color="red"' : ""}]\n`;
      const content = await load(`${page}.ts`);
      const matches = (content || "").matchAll(/navigate\((.*)\)/g);
      for (const match of matches) {
        const param = match[1].replace(/["']/g, "");
        connections += `"${page}" -> "${param}"\n`;
      }
    }

    const svg = viz.renderSVGElement(`digraph { rankdir="LR" ${connections} }`);

    document.getElementById("graph")?.replaceChildren(svg);

    for (const node of document.getElementsByClassName("node")) {
      node.addEventListener("click", () => {
        game.state.currentPage = node.id;
      });
    }
  });
}
