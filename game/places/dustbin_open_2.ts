//game.spawnItemOnce("banana", place.get("slot1"))


place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})

/*
place.getMany(/slot\d/).map(slot => {
    slot
        .hide()
        .onOtherDragStart(() => slot.show())
        .onOtherDragEnd(() => slot.hide())
        .onOtherDrop(item => item.anchor(slot))
})
*/

place.get("lid").onClick(() => {
    void game.getSound("container").play();
    game.navigate("trashbins");
})
