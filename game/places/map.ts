// this function is named like this on purpose because navigate() is recognized by the debug view
function bike_navigate(location: string) {
    game.state.mapNextLocation = location;
    game["navigate"]("bike");
}


place.get('home').onClick(() => {
    bike_navigate('room')
})

place.get('friend').onClick(() => {
    bike_navigate('linas_house')
})

place.get('locksmith').onClick(() => {
    bike_navigate('locksmith')
})


const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
place.get('supermarket').onClick(async () => {
    if (itemsInInventory.findIndex(item => item.itemName == "meme") == -1) {
        bike_navigate('supermarket')
    } else {
        bike_navigate('backdoor_supermarket')
    }
})
