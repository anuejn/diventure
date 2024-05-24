place.get('side').onClick(() => {
    void game.getSound("step_back").play();
    game.navigate('map')
})
