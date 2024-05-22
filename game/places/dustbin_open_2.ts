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

if (!place.state.spawnedTrash) {
    place.state.spawnedTrash = true;
    await game.spawnItemUnique("boxtrash", place.get("slot_03"))
    await game.spawnItemUnique("trashbag2", place.get("slot_05"))
    await game.spawnItemUnique("trashbag1", place.get("slot_08"))
    await game.spawnItemUnique("papertrash", place.get("slot_14"))
    await game.spawnItemUnique("trashbag3", place.get("slot_16"))
    await game.spawnItemUnique("plasticbag", place.get("slot_17"))
    await game.spawnItemUnique("trashbag4", place.get("slot_22"))
    await game.spawnItemUnique("banana_bread", place.get("slot_26"))
    await game.spawnItemUnique("trashbag5", place.get("slot_26"))
}