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


const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
place.get('supermarket').onClick(async () => {
    if (itemsInInventory.findIndex(item => item.itemName == "meme") == -1) {
        game.navigate('supermarket')
        void game.getSound("door_bell1").play();
    } else {
        game.navigate('backdoor_supermarket')
    }

})