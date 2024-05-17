place.get('home').onClick(() => {
    game.navigate('room')
})

place.get('friend').onClick(() => {
    game.navigate('Linas_house')
})

place.get('locksmith').onClick(() => {
    game.navigate('locksmith')
    game.getSound("door_bell2").play();
})

place.get('supermarket').onClick(() => {
    game.navigate('supermarket')
    game.getSound("door_bell1").play();
})

place.get('supermarket').onOtherDrop(item => {
    if (item.itemName == "meme") {
        game.navigate('backdoor_supermarket')
    }
})