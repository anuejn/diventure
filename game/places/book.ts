place.get('cover').onClick(() => {
    game.navigate('room')
})

const shoppinglist = (await game.loadOrGetItem("shoppinglist"));
if (!shoppinglist.isAnchored()) {
    shoppinglist.anchor(place.get("slot_paper"))
}

