place.get("floor").onClick(() => {
    game.getSound("step_back").play();
    game.navigate("backdoor_supermarket");
})

place.get("bin1").onClick(() => {
    game.navigate("dustbin_open");
    game.getSound("container").play();
})

place.get("bin2").onClick(() => {
    game.navigate("dustbin_open");
    game.getSound("container").play();
})

