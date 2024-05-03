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
    game.getSound("plates").play()
})

function updateTap() {
    game.getSound("tapwater").setLoop().play(place.state.tap_on);
    place.get('bg_water').show(place.state.tap_on);
}
updateTap()
place.get('tap').onClick(() => {
    place.state.tap_on = !place.state.tap_on;
    updateTap()
})
place.onLeave(() => {
    game.getSound("tapwater").pause();
})

const items = ["flour", "sugar", "chocolate", "eggs", "butter"];

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
function posterOnOff(button: string, bg_button: string){
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