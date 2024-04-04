game.get('uni').hide()

game.get('home').onClick(() => {
    game.state.mapNextLocation = 'room';
    game.navigate('bike')
})