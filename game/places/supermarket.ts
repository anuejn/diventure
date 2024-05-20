place.get("cart").show(place.state.showCart || false)

const dialog = place.get("dialog_box").dialog();
(async () => {
    await place.get("dude").waitClick();
    await dialog.sayRight("Hello");
    await dialog.sayRight("How can I help you?");

    const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
    if (itemsInInventory.findIndex(item => item.itemName == "shoppinglist") == -1) {
        dialog.answerOptionsLoop({
            "Oh shit, I forgot my shopping list at home": async () => {
                await dialog.sayLeft("Probably in my Book on the Table")
                await dialog.sayRight("Then you better get it.")
                await dialog.sayRight("See you!")
                await sleep(2000)
                await dialog.destroy()
            },
            "Actually, I have to go": async () => {
                await dialog.sayRight("Oh, so fast?")
                await dialog.sayRight("You did not even buy anything!")
                await sleep(2000)
                await dialog.destroy()
            },
        })
    } else {
        dialog.answerOptionsLoop({
            "I brought my shopping list": async () => {
                await dialog.sayLeft("Can you get me the stuff on it?")
                await dialog.sayRight("If you give it to me...")

                const hintTimeout = setTimeout(() => dialog.sayRight("You actually have to give the list to me"), 10000)
                const shoppinglist = await place.get("dude").waitOtherDrop(item => item.itemName == "shoppinglist");
                clearTimeout(hintTimeout);
                shoppinglist.hide()
                await dialog.sayLeft("Here is it!");

                await dialog.sayRight("Looks like you want to bake a cake!");
                await sleep(1000)

                await dialog.sayRight("That would make €€€")
                const hint2Timeout = setTimeout(() => dialog.sayRight("well, now you also have to give me money!"), 10000);
                const cash = await place.get("dude").waitOtherDrop(item => item.itemName == "cash")
                clearTimeout(hint2Timeout);
                cash.destroy()

                place.get("cart").show()
                place.state.showCart = true;

                await game.spawnItemOnce("flour", place.get("slot_1"))
                await game.spawnItemOnce("chocolate", place.get("slot_2"))
                await game.spawnItemOnce("sugar", place.get("slot_3"))
                await game.spawnItemOnce("eggs", place.get("slot_4"))
                await game.spawnItemOnce("butter", place.get("slot_5"))

                shoppinglist.destroy()

                await dialog.sayLeft("Here you go");
                await dialog.sayRight("Have a nice day!");
                await dialog.sayRight("And don't forget anything.");
            },
            "Where are all the products?": async () => {
                await dialog.sayLeft("What a wiered supermarket is this?")
                await dialog.sayLeft("I don't even see shelves!")
                await dialog.sayRight("Well...")
                await dialog.sayRight("Building a supermarket in a video game is a lot of work")
                await dialog.sayRight("So in this shop, you just give me your shopping list and get the products")
                await dialog.sayRight("Good enough, eh?")
            },
        })
    }
})()

place.get('exit').onClick(() => {
    game.getSound("door_exit").play();
    game.navigate('map')
})
