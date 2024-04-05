import { load } from "./loader";

export async function loadSvg(path: string): Promise<SVGElement> {
  const svg = (await load(path)) || "<svg></svg>";
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
