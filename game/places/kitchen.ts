place.get('door').onClick(() => {
    game.navigate('room')
})
place.get('fridge').onClick(() => {
    game.navigate('fridge')
})
place.get('upper_closet').onClick(() => {
    game.navigate('upper_closet')
})
place.get('lower_closet').onClick(() => {
    game.navigate('lower_closet')
})
place.get('dishes').onClick(() => {
    //sound.get("plates").play();
})
place.get('bg_water').hide()
let tap_on = false;
place.get('tap').onClick(() => {
    if(tap_on === false){
        tap_on = true;
        //sound.get("tapwater").play();
        place.get('bg_water').show()}
    else{
        tap_on = false;
        //sound.get("tapwater").pause();
        place.get('bg_water').hide()}
})

const items = ["flour", "sugar", "chocolate", "eggs"];

const oven = place.get('oven')
oven.onOtherDrop(async item => {
    console.log(item.itemName)
    if (items.includes(item.itemName)) {
        console.log("anchored")
        item.anchor(oven)
    }

    // check if everythimg is there
    const itemsInOven = oven.anchoredItems().map(item => item.itemName);
    if (JSON.stringify(items.sort()) == JSON.stringify(itemsInOven.sort())) {
        for (const item of oven.anchoredItems()) {
            item.destroy()
        }
        game.spawnItemOnce("cake", place.get("oven"))
    }
    
})


// Buttons of the Oven
function posterOnOff(button, bg_button){
    let button_turned = false;
    place.get(button).onClick(() => {
        if(button_turned === false){
            button_turned = true;
            place.get(bg_button).show()}
        else{
            button_turned = false;
            place.get(bg_button).hide()}
    })
}

place.get("bg_button1").hide()
place.get("bg_button2").hide()
place.get("bg_button3").hide()
place.get("bg_button4").hide()
posterOnOff("ovenbutton1", "bg_button1")
posterOnOff("ovenbutton2", "bg_button2")
posterOnOff("ovenbutton3", "bg_button3")
posterOnOff("ovenbutton4", "bg_button4")