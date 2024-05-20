import { makePinkTransparent, makePointerEvents } from "./svg-utils";

const basePath = "../../game/";
const svgs = import.meta.glob("../../game/**/*.svg", {
  query: "?url",
  import: "default",
});
const ts = import.meta.glob("../../game/**/*.ts", {
  query: "?worker&url",
  import: "default",
});

export async function loadSvg(path: string): Promise<SVGElement | undefined> {
  if (!(basePath + path in svgs)) return undefined;
  const url = (await svgs[basePath + path]()) as string;
  const svg = (await fetch(url).then((x) => x.text())) as string;
  if (!svg) {
    throw Error(`could not find svg at path ${path}`);
  }
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svg, "image/svg+xml");
  const svgElement = svgDoc.children[0] as SVGElement;
  makePinkTransparent(svgElement);
  makePointerEvents(svgElement, "none");

  return svgElement;
}

export async function loadTsString(path: string): Promise<string | undefined> {
  if (!(basePath + path in ts)) return undefined;
  const url = (await ts[basePath + path]()) as string;
  const string = (await fetch(url).then((x) => x.text())) as string;
  return string.replace(
    `import "/node_modules/vite/dist/client/env.mjs"\n`,
    "",
  );
}

export async function loadTs(
  path: string,
  environment: Record<string, unknown>,
): Promise<unknown> {
  const string = await loadTsString(path);
  const code = `async ({ ${Object.keys(environment).join(",")} }) => {\n${string}\n}`;
  try {
    const fn = eval(code);
    return await fn(environment);
  } catch(e) {
    console.error(`error while executing ${path}:`);
    console.error(e);
  }
}

export async function elementsOfKind(
  kind: "places" | "items" | "controls",
): Promise<string[]> {
  return [
    ...new Set(
      [...Object.keys(ts), ...Object.keys(svgs)]
        .filter(
          (x) =>
            x.startsWith(`${basePath}${kind}/`) &&
            (x.endsWith(".ts") || x.endsWith(".svg")),
        )
        .map((x) =>
          x
            .replace(`${basePath}${kind}/`, "")
            .replace(".ts", "")
            .replace(".svg", ""),
        ),
    ),
  ];
}
