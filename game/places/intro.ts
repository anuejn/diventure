
//INTRO
place.get('bg_dumpster').hide()
place.get('bg_trashcan').hide()

if (game.state.hadLastDialog) { // OUTRO
    place.get('bg_dumpster').show()
    place.get('bg_trashcan').show()
    place.get('bg_play').hide()
    place.get('bg_symbol_play').hide()
}

place.get('play').onClick(() => {
    game.navigate('kitchen') //???
})