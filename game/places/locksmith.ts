place.get('exit').onClick(() => {
    game.getSound("door_exit").play();
    game.navigate('map')
})

let click1 = false;
let click2 = false;

place.get('speech').hide()
place.get('speech2').hide()
place.get('dude').onClick(() => {
    if(click1 == false && click2 == false){
        click1 = true;
        place.get('speech').show()
    }
    else if(click1 == true && click2 == false) {
        click2 = true;
        place.get('speech2').show()
    }
    else{
        click1 = click2 = false;
        place.get('speech').hide()
        place.get('speech2').hide()
    }
})