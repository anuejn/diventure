place.get('door').onClick(() => {
    game.navigate('room')
    void game.getSound("door_handle").play();
})
place.get('fridge').onClick(() => {
    game.navigate('fridge')
})
place.get('upper_closet').onClick(() => {
    game.getSound("closet_open").play();
    game.navigate('upper_closet')
})
place.get('lower_closet').onClick(() => {
    game.getSound("closet_open").play();
    game.navigate('lower_closet')
})
place.get('dishes').onClick(() => {
    void game.getSound("plates").play()
})

let light_on = false;
let oven_open = false;
place.get('oven_open').hide()
place.get('oven_light').hide()
place.get('oven_light_inside').hide()

place.get('ovenbutton').onClick(() => {
    light_on = !light_on;
    void updateOvenOpenState();
    void game.getSound("light_switch").play();
})

const oven = place.get('oven')


const recepies: Record<string, string[]> = {
    "cake": ["flour", "sugar", "chocolate", "eggs", "butter"],
    "bananabread": ["flour", "sugar", "banana", "oil_sunflower"],
}
oven.onOtherDrop(async item => {
    if (!oven_open) return;

    item.anchor(oven)
})

async function updateOvenOpenState() {
    (await oven.anchoredItems()).forEach(item => {
        item.show(oven_open)
    })
    place.get('oven_open').show(oven_open)
    place.get('oven_light_inside').show(oven_open)

    place.get('oven_light').show(light_on && !oven_open)
    place.get('oven_light_inside').show(light_on && oven_open)

    if (!open) {
        oven.onClick(() => {
            oven_open = true;
            void updateOvenOpenState()
        })
    }

    // here we actually bake
    if (!oven_open && light_on) {
        const itemsInOven = (await oven.anchoredItems()).map(item => item.itemName).sort();
        const bake_result = Object.keys(recepies).find(k => JSON.stringify(recepies[k].sort()) == JSON.stringify(itemsInOven))
        if (bake_result) {
            for (const item of await oven.anchoredItems()) {
                item.destroy()
            }
            (await game.spawnItem(bake_result, place.get("oven")))?.hide()
            await sleep(1000);
            await game.getSound("bike_bell").play()
        } else {
            const dialog = place.get("dialog_oven").dialog("right");
            (async () => {
                if (itemsInOven.length == 0) {
                    await dialog.sayOther("Seems like you want me to bake something for you")
                    await dialog.sayOther("But for that I need ingredients")
                } else {
                    await dialog.sayOther("I really don't know what to make with the combination of stuff you put into me")
                }
                await dialog.destroy();
            })()
        }
    }
}
await updateOvenOpenState()
oven.onClick(() => {
    oven_open = true;
    void updateOvenOpenState()
})
place.get('oven_close').onClick(() => {
    oven_open = false;
    void updateOvenOpenState()
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



// Buttons of the Oven
function buttonsOnOff(button: string, bg_button: string, gas: string) {
    let button_turned = false;
    place.get(bg_button).hide()
    place.get(gas).hide()


    place.get(button).onClick(() => {
        void game.getSound("oven_switch").play();
        button_turned = !button_turned;
        place.get(bg_button).show(button_turned)
        void game.getSound("gas_oven", bg_button).setLoop().play(button_turned)
        place.get(gas).show(button_turned)
    })
    place.onLeave(() => {
        void game.getSound("gas_oven", bg_button).pause()
        place.get(gas).hide()
    })
}

buttonsOnOff("ovenbutton1", "bg_button1", "gas_left")
buttonsOnOff("ovenbutton2", "bg_button2", "gas_left_back")
buttonsOnOff("ovenbutton3", "bg_button3", "gas_right")
buttonsOnOff("ovenbutton4", "bg_button4", "gas_right_back")




if (game.state.wasDumpsterDiving && !place.state.spawnedInvitation2) {
    (async () => {
        await sleep(1000)
        await game.getSound("step_back").play()
        await game.spawnItemOnce("invitation2", place.get("invitation2_spawn"), { size: "fill" })
        place.state.spawnedInvitation2 = true;
    })()
}