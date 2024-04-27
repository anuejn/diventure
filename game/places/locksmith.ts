place.get('exit').onClick(() => {
    game.navigate('map')
})

place.get('speech').hide()
place.get('dude').onClick(() => {
    place.get('speech').show()
})