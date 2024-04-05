import { load } from "./loader";

export async function loadTs(path: string): Promise<undefined> {
  const ts = await load(path);
  if (ts) {
    // TODO: add typescript type stripping
    eval(ts);
  }
}
