place.get('bg_cashier').onClick(() => {
    game.navigate('map')
})

place.get('speech').hide()
place.get('speech_2').hide()
place.get('speech_3').hide()
place.get('dude').onClick(() => {
    place.get('speech').show()
    place.get('dude').onOtherDrop(item => {
        item.anchor(place.get("dude")).hide()
        place.get('speech_2').show()
    } )
})

async function spawnObjectInSlot(itemName:string, slot:string){
    const item = (await game.loadOrGetItem(itemName));
    if (!item.isAnchored()) {
        item.anchor(place.get(slot))
    }
}

spawnObjectInSlot("flour", "slot_1")
spawnObjectInSlot("chocolate", "slot_2")
spawnObjectInSlot("sugar", "slot_3")
spawnObjectInSlot("eggs", "slot_4")