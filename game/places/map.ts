function navigateByBike(location: string) {
    game.state.mapNextLocation = location;
    game.navigate("bike");
}


place.get('home').onClick(() => {
    navigateByBike('room')
})

place.get('friend').onClick(() => {
    navigateByBike('linas_house')
})

place.get('locksmith').onClick(() => {
    navigateByBike('locksmith')
})


const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
place.get('supermarket').onClick(async () => {
    if (itemsInInventory.findIndex(item => item.itemName == "meme") == -1) {
        navigateByBike('supermarket')
    } else {
        navigateByBike('backdoor_supermarket')
    }
})
