
place.get('exit').onClick(() => {
    game.navigate('map')
})

let shoppinglist_handed = 0;

place.get('speech').hide()
place.get('speech_2').hide()
place.get('speech_3').hide()
place.get('dude').onClick(() => {
    if (shoppinglist_handed != 1) {
        place.get('speech').show()
    }
})

place.get("cart").hide()

place.get('dude').onOtherDrop(item => {
    if (item.itemName == "shoppinglist") {
        shoppinglist_handed = 1;
        item.destroy()
        place.get('speech_2').show()
    }

    if (shoppinglist_handed == 1 && item.itemName == "cash") {
        item.destroy()
        place.get("cart").show()


        game.spawnItemOnce("flour", place.get("slot_1"))
        game.spawnItemOnce("chocolate", place.get("slot_2"))
        game.spawnItemOnce("sugar", place.get("slot_3"))
        game.spawnItemOnce("eggs", place.get("slot_4"))
        place.get('speech_3').show()
    }
})
