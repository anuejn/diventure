place.get('door').onClick(() => {
    game.navigate('kitchen')
})

place.get('book').onClick(() => {
    game.navigate('book')
})

place.get('bike').onClick(() => {
    game.navigate('map')
})

place.get('chair').onClick(() => {
    //sound.get("chair").play();
})

function posterOnOff(posterX, picture){
    let poster_on = false;
    place.get(posterX).onClick(() => {
        if(poster_on === false){
            poster_on = true;
            place.get(picture).show()}
        else{
            poster_on = false;
            place.get(picture).hide()}
    })
}

place.get("banana1").hide()
place.get("racoon1").hide()
place.get("thomas").hide()
posterOnOff("poster1", "banana1")
posterOnOff("poster3", "racoon1")
posterOnOff("poster2", "thomas")