// TDOO: this is our preliminary static loader

const basePath = "../example";
const data = import.meta.glob("../example/**/*", {
  query: "?raw",
  import: "default",
});

export async function load(path: string): Promise<string | undefined> {
  const entry = data[`${basePath}/${path}`];
  if (entry) {
    return (await entry()) as string;
  }
}

export async function places(): Promise<string[]> {
  return [
    ...new Set(
      Object.keys(data)
        .filter(
          (x) =>
            x.startsWith(basePath + "/places/") &&
            (x.endsWith(".ts") || x.endsWith(".svg")),
        )
        .map((x) =>
          x
            .replace(basePath + "/places/", "")
            .replace(".ts", "")
            .replace(".svg", ""),
        ),
    ),
  ];
}
