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
): [SVGElement, string][] {
  const elements = svg.getElementsByTagName(
    "*",
  ) as HTMLCollectionOf<SVGElement>;
  const list = [];
  for (const element of elements) {
    const elementLabel = element.getAttribute("inkscape:label");
    if (elementLabel != undefined && pattern.test(elementLabel)) {
      list.push([element, elementLabel] as [SVGAElement, string]);
    }
  }
  return list;
}

/**
 * Calculates the scale of the object in px/meter
 * @returns the scale factor
 */
export function getSvgScale(svg: SVGElement): number {
  const { width, height } = svg.getBoundingClientRect();
  const viewBox = getSvgViewBox(svg);
  const scaleX = width / viewBox.width;
  const scaleY = height / viewBox.height;
  return Math.min(scaleX, scaleY);
}

export function isPointInSvgElement(
  svg: SVGElement,
  x: number,
  y: number,
): boolean {
  for (const element of document.elementsFromPoint(x, y)) {
    if (
      (svg.contains(element) || element == svg) &&
      element instanceof SVGGeometryElement
    ) {
      return true;
    }
  }
  return false;
}

export function makePointerEvents(svgElement: SVGElement, x: "none" | "auto") {
  svgElement.style.pointerEvents = x;
  const elements = svgElement.getElementsByTagName(
    "*",
  ) as HTMLCollectionOf<SVGElement>;
  for (const element of elements) {
    if (element.style) {
      element.style.pointerEvents = x;
    }
  }
}

export function makePinkTransparent(svgElement: SVGElement) {
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

const blobUrlCache: Record<string, string> = {};
async function fetchToBlobUrl(url: string) {
  if (!(url in blobUrlCache)) {
    blobUrlCache[url] = await fetch(url)
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));
  }
  return blobUrlCache[url];
}

export async function preloadImages(svgElement: SVGElement): Promise<void> {
  const images = svgElement.getElementsByTagName(
    "image",
  ) as HTMLCollectionOf<SVGImageElement>;
  const promises = [...images].map((img) => preloadImage(img));
  await Promise.all(promises);
}

// this is a horrible workaround agains just calling img.decode throwing a "DOMException: Invalid image request."
async function preloadImage(image: SVGImageElement) {
  const newImage = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "image",
  );
  [...image.attributes]
    .filter((attr) => attr.nodeName != "href" && attr.nodeName != "xlink:href")
    .forEach((attr) => {
      newImage.setAttribute(attr.nodeName, attr.nodeValue || "");
    });
  const blob = await fetchToBlobUrl(image.href.baseVal);
  newImage.setAttribute("href", blob);
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await newImage.decode();
  } catch (e) {
    // image.decode() is not implemented by some browsers.
  }
  image.replaceWith(newImage);
}
