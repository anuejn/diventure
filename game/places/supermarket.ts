place.get("cart").show(place.state.showCart || false)

const dialog = place.get("dialog_box").dialog("left");
(async () => {
    await place.get("dude").waitClick();
    await dialog.sayOther("Hello");
    await dialog.sayOther("How can I help you?");

    const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
    if (itemsInInventory.findIndex(item => item.itemName == "shoppinglist") == -1) {
        dialog.answerOptionsLoop({
            "Oh shit, I forgot my shopping list at home": async () => {
                await dialog.sayMe("Probably in my Book on the Table")
                await dialog.sayOther("Then you better get it.")
                await dialog.sayOther("See you!")
                await sleep(2000)
                await dialog.destroy()
            },
            "Actually, I have to go": async () => {
                await dialog.sayOther("Oh, so fast?")
                await dialog.sayOther("You did not even buy anything!")
                await sleep(2000)
                await dialog.destroy()
            },
        })
    } else {
        dialog.answerOptionsLoop({
            "I brought my shopping list": async () => {
                await dialog.sayMe("Can you get me the stuff on it?")
                await dialog.sayOther("If you give it to me...")

                const hintTimeout = setTimeout(() => dialog.sayOther("You actually have to give the list to me"), 10000)
                const shoppinglist = await place.get("dude").waitOtherDrop(item => item.itemName == "shoppinglist");
                clearTimeout(hintTimeout);
                shoppinglist.hide()
                await dialog.sayMe("Here is it!");

                await dialog.sayOther("Looks like you want to bake a cake!");
                await sleep(1000)

                await dialog.sayOther("That would make €€€")
                const hint2Timeout = setTimeout(() => dialog.sayOther("well, now you also have to give me money!"), 10000);
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

                await dialog.sayMe("Here you go");
                await dialog.sayOther("Have a nice day!");
                await dialog.sayOther("And don't forget anything.");
                await sleep(2000);
                await dialog.destroy()
            },
            "Where are all the products?": async () => {
                await dialog.sayMe("What a wiered supermarket is this?")
                await dialog.sayMe("I don't even see shelves!")
                await dialog.sayOther("Well...")
                await dialog.sayOther("Building a supermarket in a video game is a lot of work")
                await dialog.sayOther("So in this shop, you just give me your shopping list and get the products")
                await dialog.sayOther("Good enough, eh?")
            },
        })
    }
})()

place.get('exit').onClick(() => {
    game.getSound("door_exit").play();
    game.navigate('map')
})
