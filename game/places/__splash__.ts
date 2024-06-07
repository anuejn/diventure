place.get('bg_dumpster').hide()
place.get('bg_trashcan').hide()
place.get('load').hide()

if (game.state.hadLastDialog) { // OUTRO
    place.get('bg_dumpster').show()
    place.get('bg_trashcan').show()
    place.get('bg_play').hide()
    place.get('bg_symbol_play').hide()
}

async function loadGame() {
    place.get('play').hide()
    place.get('continue').hide()
    place.get('reset').hide()
    place.get('load').show()
        await game.preloadResources(progress => {
            for (let i = 1; i < progress * 32; i++) {
                place.get(`rect${String(i).padStart(2, '0')}`).hide()
            }
        })
        game.start();
}

if (game.state.currentPlace != "__start__") {
    // we have already played the game before
    place.get("play").hide()

    place.get("continue").onClick(async () => {
        await loadGame()
        game.start();
    })
    place.get("reset").onClick(() => {
        game.reset();
    })
} else {
    // we are playing the game for the first time or have just reset it...
    place.get("reset").hide()
    place.get("continue").hide()

    place.get('play').onClick(async () => {
        await loadGame()
        game.start();
    })    
}

