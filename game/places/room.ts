await game.getSound("front_door").play();

place.get('door').onClick(() => {
    game.navigate('kitchen')
    void game.getSound("door_handle").play();
})

place.get('book').onClick(() => {
    game.navigate('book')
    void game.getSound("book").play();
})

place.get('bike').onClick(() => {
    game.navigate('map')
})

place.get('chair').onClick(() => {
    void game.getSound("chair").play();
})

place.get('night').hide();
let sleeping = false;
function updateSleeping() {
    place.get('night').show(sleeping);
    void game.getSound("bed").setVolume(2).play(sleeping);
}
place.get('bed').onClick(() => {
    sleeping = !sleeping;
    updateSleeping();
    setTimeout(() => {
        sleeping = false
        updateSleeping()
    }, 9000)
})
place.onLeave(() => {
    sleeping = false
    updateSleeping()
});


let radio_on = true;
place.get('radio').onClick(() => {
    void game.getSound("radio_fm").play(radio_on);
    radio_on = !radio_on;
})

let light_on = false;
place.get('light').hide()
place.get('bg_lamp').onClick(() => {
    light_on = !light_on;
    place.get('light').show(light_on)
    void game.getSound("light_switch").play();
})

function posterOnOff(posterX: string, picture: string) {
    let poster_on = false;
    place.get(picture).hide()
    place.get(posterX).onClick(() => {
        poster_on = !poster_on;
        place.get(picture).show(poster_on)
    })
}

posterOnOff("poster1", "banana1")
posterOnOff("poster3", "racoon1")
posterOnOff("poster2", "thomas")
