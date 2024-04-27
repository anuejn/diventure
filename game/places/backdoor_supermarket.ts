place.get('side').onClick(() => {
    game.navigate('map')
})

place.get('door').onClick(() => {
    game.navigate('trashbins')
})