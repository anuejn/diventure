interface Path {
  kind: "item" | "place" | "control";
  id: string;
  label?: string;
}

interface AnchorOptions {
  size: "real" | "fill";
}

interface AnchorPlacement {
  location: Path;
  options: AnchorOptions;
}

interface GameState {
  currentPlace: string;
  elementStates: Record<string, unknown>;
  anchoredItems: Record<string, AnchorPlacement>;
}
