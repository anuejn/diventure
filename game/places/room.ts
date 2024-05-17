place.get('door').onClick(() => {
    game.navigate('kitchen')
    game.getSound("door_handle").play();
})

place.get('book').onClick(() => {
    game.navigate('book')
    game.getSound("book").play();
})

place.get('bike').onClick(() => {
    game.navigate('map')
})

place.get('chair').onClick(() => {
    game.getSound("chair").play();
})

let radio_on = true;
place.get('radio').onClick(() => {
    game.getSound("radio_fm").play(radio_on);
    radio_on = !radio_on;
})

function posterOnOff(posterX, picture){
    let poster_on = false;
    place.get(posterX).onClick(() => {
        poster_on = !poster_on;
        place.get(picture).show(poster_on)
    })
}

place.get("banana1").hide()
place.get("racoon1").hide()
place.get("thomas").hide()
posterOnOff("poster1", "banana1")
posterOnOff("poster3", "racoon1")
posterOnOff("poster2", "thomas")