setTimeout(() => {
    if (game.state.mapNextLocation == undefined) {
        throw Error("no next map location was defined")
    }
    game.navigate(game.state.mapNextLocation);
    game.state.mapNextLocation = undefined;
}, 5000)