place.get('home').onClick(() => {
    game.navigate('room')
    void game.getSound("front_door").play();
})

place.get('friend').onClick(() => {
    game.navigate('linas_house')
    void game.getSound("front_door").play();
})

place.get('locksmith').onClick(() => {
    game.navigate('locksmith')
    void game.getSound("door_bell2").play();
})

place.get('supermarket').onClick(() => {
    game.navigate('supermarket')
    void game.getSound("door_bell1").play();
})

place.get('supermarket').onOtherDrop(item => {
    if (item.itemName == "meme") {
        game.navigate('backdoor_supermarket')
    }
})