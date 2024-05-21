place.get('door').onClick(() => {
    game.navigate('room')
    void game.getSound("door_handle").play();
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
    void game.getSound("plates").play()
})

void game.getSound("extractor").setLoop(true).play(place.state.extactorOn || false);
place.get('airbutton').onClick(() => {
    place.state.extactorOn = !place.state.extactorOn;
    void game.getSound("extractor").setLoop(true).play(place.state.extactorOn || false);
})

// Tap Watter:
function updateTap() {
    void game.getSound("tapwater").setLoop().play(place.state.tap_on || false);
    place.get('bg_water').show(place.state.tap_on || false);
}
updateTap()
place.get('tap').onClick(() => {
    place.state.tap_on = !place.state.tap_on;
    updateTap()
})

place.onLeave(() => {
    void game.getSound("tapwater").pause();
    void game.getSound("extractor").pause();
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
    const itemsInOven = (await oven.anchoredItems()).map(item => item.itemName);
    if (JSON.stringify(items.sort()) == JSON.stringify(itemsInOven.sort())) {
        for (const item of await oven.anchoredItems()) {
            item.destroy()
        }
        await game.spawnItemOnce("cake", place.get("oven"))
    }
})


// Buttons of the Oven
function buttonsOnOff(button: string, bg_button: string){
    let button_turned = false;
    place.get(bg_button).hide()
    place.get(button).onClick(() => {
        void game.getSound("oven_switch").play();
        button_turned = !button_turned;
        place.get(bg_button).show(button_turned)
        void game.getSound("gas_oven", bg_button).setLoop().play(button_turned)
    })
    place.onLeave(() => {
        void game.getSound("gas_oven", bg_button).pause()
    })
}

buttonsOnOff("ovenbutton1", "bg_button1")
buttonsOnOff("ovenbutton2", "bg_button2")
buttonsOnOff("ovenbutton3", "bg_button3")
buttonsOnOff("ovenbutton4", "bg_button4")



if (game.state.wasDumpsterDiving && !place.state.spawnedInvitation2) {
    (async () => {
        await sleep(1000)
        await game.getSound("step_back").play()
        await game.spawnItemOnce("invitation2", place.get("invitation2_spawn"), {size: "fill"})
        place.state.spawnedInvitation2 = true;
    })()
}