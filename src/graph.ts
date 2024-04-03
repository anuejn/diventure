import { instance } from "@viz-js/viz";
import { load, pages } from "./loader";

instance().then(async (viz) => {
  let connections = "";

  for (const page of await pages()) {
    connections += `"${page}"`;
    const content = await load(`${page}.ts`);
    const matches = (content || "").matchAll(/navigate\((.*)\)/g);
    for (const match of matches) {
      const param = match[1].replace(/["']/g, "");
      connections += `"${page}" -> "${param}"`;
    }
  }

  const svg = viz.renderSVGElement(`digraph { rankdir="LR" ${connections} }`);

  document.getElementById("graph")?.replaceChildren(svg);
});
