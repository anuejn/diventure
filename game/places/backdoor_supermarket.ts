place.get('side').onClick(() => {
    game.getSound("step_back").play();
    game.navigate('map')
})

place.get('door').onClick(() => {
    game.getSound("door_metal").play();
    game.navigate('trashbins')
})