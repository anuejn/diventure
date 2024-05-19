place.get('door').onClick(() => {
    game.navigate('map')
    game.getSound("door_handle").play();
})

let light_on = false;
place.get('bg_lamp').onClick(() => {
    light_on = !light_on;
    place.get('light').show(light_on)
    game.getSound("light_switch").play();
})

place.get('light').hide()

place.get('bg_max').hide()
place.get('bg_nadja').hide()
place.get('bg_kim').hide()

place.get('bg_gifts').hide()
place.get('bg_party').hide()


if(game.state.hasInvitation == true && game.state.hasCake == true){
    place.get('bg_max').show()
    place.get('bg_nadja').show()
    place.get('bg_kim').show()
}

let cake_handed = 0;
place.get('bg_lina').onOtherDrop(item => {
    if (item.itemName == "cake") {
        cake_handed = 1;
        item.destroy()
        place.get('bg_party').show()

        place.get('bg_gifts').show()
        game.spawnItem("cake", place.get("tablespot2"))
    }
})


let card_handed = 0;
place.get('bg_lina').onOtherDrop(item => {
    if (item.itemName == "invitation") {
        card_handed = 1;
        item.destroy()
        place.get('bg_max').show()
        place.get('bg_nadja').show()
        place.get('bg_kim').show()
    }
})


const dialog = place.get("dialog_box_lina").dialog();
(async () => {
    await place.get("bg_lina").waitClick();
    dialog.sayRight("Hii Lina!");
    await sleep(2000);
    dialog.sayLeft("Oh hello, I didn't expect you around! How are you doing?");
    await sleep(4000);
    dialog.sayRight("I am all good! I was just nearby, coming to see if you had some new gossip!");
    await sleep(4000);
    dialog.sayLeft("Haha, no sorry, not this time! That blablabla happend I already told you a while ago! So no, no entertaining news from me today!");
    await sleep(4000);
    dialog.sayRight("I also have nothing exciting to report, but it was nice to see you. See you soon then I guess!");
    await sleep(4000);
    dialog.sayLeft("See you, buy!");
    await sleep(2000);
    dialog.sayRight("Tchau!");
})()

