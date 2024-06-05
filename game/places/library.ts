await game.getSound("front_door").play();

place.get('door').onClick(() => {
    game.navigate('map')
    void game.getSound("door_handle").play();
})

let light_on = false;
place.get('lights').hide()
place.get('light_switch').onClick(() => {
    light_on = !light_on;
    place.get('lights').show(light_on)
    void game.getSound("light_switch").play();
})

place.get('cat').onClick(() => {
    void game.getSound("cat").setVolume(10).play();
})

place.get('tv').onClick(() => {
    window.open("https://youtu.be/aXByu2iraEA?si=41pXC-2rTudy681J", "_blank");
})

place.get('books').onClick(() => {
    window.open("https://robin-foods.org", "_blank");
})
