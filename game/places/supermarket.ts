await game.getSound("door_bell1").play();

place.get("cart").show(place.state.showCart || false)

let respawn_shoppinglist = false;
place.onLeave(() => {
    if (respawn_shoppinglist) {
        game.items["shoppinglist"].show()
    }
})

const dialog = place.get("dialog_box").dialog("left");
(async () => {
    await place.get("dude").waitClick();
    await dialog.sayOther("Hello");
    await dialog.sayOther("How can I help you?");

    const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
    if (itemsInInventory.findIndex(item => item.itemName == "shoppinglist") == -1) {
        await dialog.answerOptionsLoop({
            "Oh shit, I forgot my shopping list at home!": async () => {
                await dialog.sayMe("It's probably in my book on the table")
                await dialog.sayOther("Well, then you better get it.")
                await dialog.sayOther("...")
                await dialog.sayMe("...")
                await dialog.sayOther("See you!")
                await dialog.sayMe("Bye!")
                await sleep(2000)
                await dialog.destroy()
            },
            "Actually, I have to go!": async () => {
                await dialog.sayOther("Oh, already?")
                await dialog.sayOther("You didn't even buy anything!")
                await sleep(2000)
                await dialog.destroy()
            },
        })
    } else {
        await dialog.answerOptionsLoop({
            "I brought my shopping list!": async () => {
                await dialog.sayMe("Can you get me the stuff on it?")
                await dialog.sayOther("Sure, if you give me your list!")

                const hintTimeout = setTimeout(() => dialog.sayOther("You will actually have to give the list to me!"), 12000)
                const shoppinglist = await place.get("dude").waitOtherDrop(item => item.itemName == "shoppinglist");
                clearTimeout(hintTimeout);
                respawn_shoppinglist = true;
                shoppinglist.hide()
                await dialog.sayMe("Here it is!");

                await dialog.sayOther("Oh, looks like you want to bake a cake!");
                await sleep(1000)

                await dialog.sayOther("That would make €€€, please!")
                const hint2Timeout = setTimeout(() => dialog.sayOther("Well, now you will also have to give me the money!"), 12000);
                const cash = await place.get("dude").waitOtherDrop(item => item.itemName == "cash")
                clearTimeout(hint2Timeout);
                cash.destroy()

                await sleep(1000)
                place.get("cart").show()
                place.state.showCart = true;

                await game.spawnItemOnce("flour", place.get("slot_1"))
                await game.spawnItemOnce("chocolate", place.get("slot_2"))
                await game.spawnItemOnce("sugar", place.get("slot_3"))
                await game.spawnItemOnce("eggs", place.get("slot_4"))
                await game.spawnItemOnce("butter", place.get("slot_5"))

                shoppinglist.destroy();
                respawn_shoppinglist = false;

                await dialog.sayMe("There you go!");
                await dialog.sayOther("Thank you, I wish you a nice day!");
                await sleep(2000);
                await dialog.sayOther("And don't forget anything!");
                await sleep(2000);
                await dialog.destroy()
            },
            "Where are all the products?": async () => {
                await dialog.sayMe("What a weired supermarket is this?")
                await dialog.sayMe("I don't even see any shelves!")
                await dialog.sayOther("Well...")
                await dialog.sayOther("...building a supermarket in a video game is a lot of work!")
                await dialog.sayOther("So in this shop, you just give me your shopping list and get the products!")
                await sleep(2000);
                await dialog.sayOther("Good enough, eh?")
                await dialog.sayOther("We're doing it in the old fashioned way, isn't retro a thing again nowadays?")
                await dialog.sayMe("...")
                await dialog.sayOther("...")
            },
        })
    }

})()

place.get('exit').onClick(() => {
    void game.getSound("door_exit").play();
    game.navigate('map')
})