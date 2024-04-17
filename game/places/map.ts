place.get('home').onClick(() => {
    game.navigate('room')
})

place.get('friend').onClick(() => {
    game.navigate('Linas_house')
})

place.get('locksmith').onClick(() => {
    game.navigate('locksmith')
})

place.get('supermarket').onClick(() => {
    game.navigate('supermarket')
})

place.get('supermarket').onOtherDrop(item => {
    if (item.itemName == "meme") {
        game.navigate('backdoor_supermarket')
    }
})