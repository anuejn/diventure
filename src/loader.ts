// TDOO: this is our preliminary static loader

const basePath = "../example";
const data = import.meta.glob("../example/*", {
  query: "?raw",
  import: "default",
});

export async function load(path: string): Promise<string | undefined> {
  const entry = data[`${basePath}/${path}`];
  if (entry) {
    return (await entry()) as string;
  }
}

export async function pages(): Promise<string[]> {
  return Object.keys(data)
    .filter((x) => x.endsWith(".ts") && !x.endsWith(".d.ts"))
    .map((x) => x.replace(basePath + "/", "").replace(".ts", ""));
}
