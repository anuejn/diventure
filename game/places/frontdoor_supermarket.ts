place.get('entrence').onClick(() => {
    void game.getSound("step_back").play();
    game.navigate('supermarket')
})


const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
place.get('backdoor').onClick(async () => {
    if (itemsInInventory.findIndex(item => item.itemName == "meme") == -1) {
        game.navigate('backdoor_supermarket') // doesn't work ... or actually always works and shouldn't !!!
    }
})

