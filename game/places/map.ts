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

place.get('supermarket').onClick(() => {
    bike_navigate('frontdoor_supermarket')
})

place.get('library').hide()
if (game.state.hadLastDialog) {
    place.get('library').show()
    place.get('library').onClick(() => {
        bike_navigate('library')
    })    
}
