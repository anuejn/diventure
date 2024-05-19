place.get("cart").show(place.state.showCart || false)

const dialog = place.get("dialog_box").dialog();
(async () => {
    await place.get("dude").waitClick();
    dialog.sayRight("Hello!");
    await sleep(1000);
    dialog.sayRight("What can I bring you?");

    const hintTimeout = setTimeout(() => dialog.sayRight("You have to give me your shopping list for me to know what to get you"), 10000)
    const shoppinglist = await place.get("dude").waitOtherDrop(item => item.itemName == "shoppinglist");
    shoppinglist.hide()
    clearTimeout(hintTimeout);

    dialog.sayRight("That would make €€€")
    const hint2Timeout = setTimeout(() => dialog.sayRight("Hey, now you also have to give me money!"), 10000);
    const cash = await place.get("dude").waitOtherDrop(item => item.itemName == "cash")
    cash.hide()
    clearTimeout(hint2Timeout);

    place.get("cart").show()
    place.state.showCart = true;

    game.spawnItemOnce("flour", place.get("slot_1"))
    game.spawnItemOnce("chocolate", place.get("slot_2"))
    game.spawnItemOnce("sugar", place.get("slot_3"))
    game.spawnItemOnce("eggs", place.get("slot_4"))
    game.spawnItemOnce("butter", place.get("slot_5"))

    shoppinglist.destroy()
    cash.destroy()

    dialog.sayRight("Here you go");
    await sleep(1000);
    dialog.sayRight("Have a nice day!");
})()

place.get('exit').onClick(() => {
    game.getSound("door_exit").play();
    game.navigate('map')
})
