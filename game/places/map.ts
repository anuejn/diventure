place.get('uni').hide()

place.get('home').onClick(() => {
    game.state.mapNextLocation = 'room';
    game.navigate('bike')
})

place.get('friend').onClick(() => {
    game.navigate('Linas_house')
})