function makePinkTransparent() {
  const elements = game.currentPage.getElementsByTagName(
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

const hooks = [makePinkTransparent];
export default hooks;
