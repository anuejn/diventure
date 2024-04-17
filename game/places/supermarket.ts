
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
        item.anchor(place.get("dude")).hide()
        place.get('speech_2').show()
    }

    if (shoppinglist_handed == 1 && item.itemName == "cash") {
        item.anchor(place.get("dude")).hide()
        place.get("cart").show()

        spawnObjectInSlot("flour", "slot_1")
        spawnObjectInSlot("chocolate", "slot_2")
        spawnObjectInSlot("sugar", "slot_3")
        spawnObjectInSlot("eggs", "slot_4")
        place.get('speech_3').show()
    }
})

async function spawnObjectInSlot(itemName: string, slot: string) {
    const item = (await game.loadOrGetItem(itemName));
    if (!item.isAnchored()) {
        item.anchor(place.get(slot))
    }
}

