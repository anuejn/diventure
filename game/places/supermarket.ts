place.get("cart").show(place.state.showCart || false)

const dialog = place.get("dialog_box").dialog();
(async () => {
    await place.get("dude").waitClick();
    await dialog.sayRight("Hello");
    await dialog.sayRight("How can I help you?");

    const hintTimeout = setTimeout(() => dialog.sayRight("If you give me your shopping list, I can fetch you the products!"), 10000)
    const shoppinglist = await place.get("dude").waitOtherDrop(item => item.itemName == "shoppinglist");
    clearTimeout(hintTimeout);
    shoppinglist.hide()
    await dialog.sayLeft("Here is my shopping list");


    await dialog.sayRight("Thanks, that would make €€€!")
    const hint2Timeout = setTimeout(() => dialog.sayRight("Well, now you will also have to give me the money!"), 10000);
    const cash = await place.get("dude").waitOtherDrop(item => item.itemName == "cash")
    clearTimeout(hint2Timeout);
    cash.destroy()

    place.get("cart").show()
    place.state.showCart = true;

    game.spawnItemOnce("flour", place.get("slot_1"))
    game.spawnItemOnce("chocolate", place.get("slot_2"))
    game.spawnItemOnce("sugar", place.get("slot_3"))
    game.spawnItemOnce("eggs", place.get("slot_4"))
    game.spawnItemOnce("butter", place.get("slot_5"))

    shoppinglist.destroy()

    await dialog.sayLeft("Here you go");
    await dialog.sayRight("Have a nice day!");
    await dialog.sayRight("And don't forget anything.");
})()

place.get('exit').onClick(() => {
    game.getSound("door_exit").play();
    game.navigate('map')
})
