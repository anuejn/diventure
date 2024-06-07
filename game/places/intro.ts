
//INTRO
place.get('bg_dumpster').hide()
place.get('bg_trashcan').hide()
place.get('load').hide()

if (game.state.hadLastDialog) { // OUTRO
    place.get('bg_dumpster').show()
    place.get('bg_trashcan').show()
    place.get('bg_play').hide()
    place.get('bg_symbol_play').hide()
}

place.get('play').onClick(async () => {
    place.get('play').hide()
    place.get('load').show()
    await game.preloadResources(progress => {
        for (let i = 1; i < progress * 32; i++) {
            place.get(`rect${String(i).padStart(2, '0')}`).hide()
        }
    })
    game.navigate('kitchen') //???
})

