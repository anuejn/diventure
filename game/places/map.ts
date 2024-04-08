place.get('uni').hide()

place.get('home').onClick(() => {
    game.state.mapNextLocation = 'room';
    game.navigate('bike')
})