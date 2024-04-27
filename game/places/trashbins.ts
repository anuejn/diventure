place.get("floor").onClick(() => {
    game.navigate("map");
})

place.get("bin1").onClick(() => {
    game.navigate("dustbin_open");
})

place.get("bin2").onClick(() => {
    game.navigate("dustbin_open");
})

