place.get('entrence').onClick(() => {
    game.navigate('supermarket')
})


const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
if (itemsInInventory.findIndex(item => item.itemName == "gloves") != -1) {
    place.get('backdoor').onClick(async () => {
        game.navigate('backdoor_supermarket')
    })
}

let light_on = false;
place.get('lights').hide()
place.get('light_switch').onClick(() => {
    light_on = !light_on;
    place.get('lights').show(light_on)
    void game.getSound("streetlamp_switch").play();
})

if(game.state.partyOver){
    place.get('sticker').onClick(() => {
        game.navigate('streetlamp')
    })
}

place.get('side').onClick(() => {
    void game.getSound("step_back").play();
    game.navigate('map')
})
