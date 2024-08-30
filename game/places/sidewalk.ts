place.get('side').onClick(() => {
    void game.getSound("step_back").play();
    game.navigate('map')
})

let light_on = false;
place.get('lights').hide()
place.get('light_switch').onClick(() => {
    light_on = !light_on;
    place.get('lights').show(light_on)
    void game.getSound("streetlamp_switch").play();
})

place.get('sticker').onClick(() => {
    game.navigate('streetlamp2')
})