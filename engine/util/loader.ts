import {
  makePinkTransparent,
  makePointerEvents,
  preloadImages,
} from "./svg-utils";

const basePath = "../../game/";
const svgs = import.meta.glob("../../game/**/*.svg", {
  query: "?url",
  import: "default",
});
const ts = import.meta.glob("../../game/**/*.ts", {
  query: "?worker&url",
  import: "default",
});
const sounds = import.meta.glob("../../game/sounds/*", {
  query: "?url",
  import: "default",
});

const textCache: Record<string, string> = {};
async function fetchText(url: string) {
  if (!(url in textCache)) {
    textCache[url] = await fetch(url).then((res) => res.text());
  }
  return textCache[url];
}

const arrayBufferCache: Record<string, AudioBuffer> = {};
async function fetchAudioBuffer(url: string) {
  if (!(url in arrayBufferCache)) {
    try {
      arrayBufferCache[url] = await fetch(url)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => game.audioContext.decodeAudioData(arrayBuffer));
    } catch (e) {
      console.warn(`failed to load audio file: ${url}:`);
      console.warn(e);
    }
  }
  return arrayBufferCache[url];
}

export async function preloadResources(
  progressCallback: (progress: number) => void,
) {
  const total = Object.values(sounds).length + Object.entries(svgs).length;
  let loaded = 0;
  progressCallback(loaded / total);

  await Promise.all([
    ...Object.values(sounds).map(async (resource) => {
      const url = (await resource()) as string;
      await fetchAudioBuffer(url);
      loaded += 1;
      progressCallback(loaded / total);
    }),
    ...Object.values(ts).map(async (resource) => {
      const url = (await resource()) as string;
      await fetchText(url);
    }),
    ...Object.keys(svgs).map(async (path) => {
      await loadSvg(path.replace(basePath, ""));
      loaded += 1;
      progressCallback(loaded / total);
    }),
  ]);
}

export async function loadSvg(path: string): Promise<SVGElement | undefined> {
  if (!(basePath + path in svgs)) return undefined;
  const url = (await svgs[basePath + path]()) as string;
  const svg = await fetchText(url);
  if (!svg) {
    throw Error(`could not find svg at path ${path}`);
  }
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svg, "image/svg+xml");
  const svgElement = svgDoc.children[0] as SVGElement;
  makePinkTransparent(svgElement);
  makePointerEvents(svgElement, "none");
  await preloadImages(svgElement);

  return svgElement;
}

export async function loadTsString(path: string): Promise<string | undefined> {
  if (!(basePath + path in ts)) return undefined;
  const url = (await ts[basePath + path]()) as string;
  const string = await fetchText(url);
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
  } catch (e) {
    console.error(`error while executing ${path}:`);
    console.error(e);
  }
}

export function elementsOfKind(
  kind: "places" | "items" | "controls",
): string[] {
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

export function loadSound(name: string): Promise<AudioBuffer> {
  const sound = Object.keys(sounds).find(
    (x) => x.replace(/\.[^/.]+$/, "") == `../../game/sounds/${name}`,
  );
  if (!sound) throw Error(`sound '${name}' not found`);

  return sounds[sound]().then((url) => fetchAudioBuffer(url as string));
}
