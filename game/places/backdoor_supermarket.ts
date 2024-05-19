place.get('side').onClick(() => {
    game.getSound("step_back").play();
    game.navigate('map')
})


let have_key = false;
let have_smith_hint = false;
let try_counter = 0;

if(have_key == false && have_smith_hint == false){
    place.get('door').onClick(() => {
        if(try_counter == 3){
            game.getSound("phone_ring").play();
            game.navigate('phone')
        }
        else{
            game.getSound("door_metal").play();
            try_counter += 1;
            if(try_counter > 3){try_counter = 0}
        }
    })
}
else{
    place.get('door').onClick(() => {
        game.getSound("door_metal").play();
        game.navigate('trashbins')
    })
}
