setTimeout(() => {
    if (game.state.mapNextLocation == undefined) {
        throw Error("no next map location was defined")
    }
    game.navigate(game.state.mapNextLocation);
    game.state.mapNextLocation = undefined;
}, 3000)

place.get("bell").onClick(() => {
    void game.getSound("bike_bell").play()
})