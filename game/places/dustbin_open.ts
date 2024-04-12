

const banana = (await game.loadOrGetItem("banana"));
if (!banana.isAnchored()) {
    banana.anchor(place.get("slot1"))
}

place.getMany(/slot\d/).map(slot => {
    slot
        .hide()
        .onOtherDragStart(() => slot.show())
        .onOtherDragEnd(() => slot.hide())
        .onOtherDrop(item => item.anchor(slot))
})

place.get("lid").onClick(() => {
    game.navigate("map");
})