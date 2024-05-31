place.get('entrence').onClick(() => {
    void game.getSound("step_back").play();
    game.navigate('supermarket')
})


const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
if (itemsInInventory.findIndex(item => item.itemName == "meme") != -1) {
    place.get('backdoor').onClick(async () => {
        game.navigate('backdoor_supermarket')
    })
}

if(game.state.wasDumpsterDiving){
    place.get('sticker').onClick(() => {
        game.navigate('streetlamp')
    })
}