export function getSvgViewBox(svg: SVGElement) {
  const viewBox = svg.getAttribute("viewBox");
  if (!viewBox) throw Error("no viewbox defined in SVG");
  const [x1, y1, x2, y2] = viewBox.split(" ").map((x) => parseFloat(x));
  return { width: x2 - x1, height: y2 - y1 };
}

export function getSvgElementByLabel(
  svg: SVGElement,
  label: string,
): SVGElement {
  const elements = svg.getElementsByTagName(
    "*",
  ) as HTMLCollectionOf<SVGElement>;
  for (const element of elements) {
    const elementLabel = element.getAttribute("inkscape:label");
    if (elementLabel != undefined && elementLabel == label) {
      return element;
    }
  }
  throw Error(`can't find object with label '${label}'`);
}

export function getSvgElementsByLabelPattern(
  svg: SVGElement,
  pattern: RegExp,
): SVGElement[] {
  const elements = svg.getElementsByTagName(
    "*",
  ) as HTMLCollectionOf<SVGElement>;
  const list = [];
  for (const element of elements) {
    const elementLabel = element.getAttribute("inkscape:label");
    if (elementLabel != undefined && pattern.test(elementLabel)) {
      list.push(element);
    }
  }
  return list;
}
