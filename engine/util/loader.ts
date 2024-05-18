// TDOO: this is our preliminary static loader

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

  return svgElement;
}
function makePinkTransparent(svgElement: SVGElement) {
  const elements = svgElement.getElementsByTagName(
    "*",
  ) as HTMLCollectionOf<SVGElement>;
  for (const element of elements) {
    if (
      element?.style?.fill == "rgb(255, 0, 255)" &&
      element?.style?.fillOpacity == "0.42"
    ) {
      element.style.fillOpacity = "0";
    }
    if (
      element?.style?.stroke == "rgb(255, 0, 255)" &&
      element?.style?.strokeOpacity == "0.42"
    ) {
      element.style.strokeOpacity = "0";
    }
  }
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
  const fn = eval(code);
  return await fn(environment);
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
