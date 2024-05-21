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

//mäh

await game.spawnItemOnce("boxtrash", place.get("slot_03"))
await game.spawnItemOnce("trashbag2", place.get("slot_05"))
await game.spawnItemOnce("trashbag1", place.get("slot_08"))
await game.spawnItemOnce("papertrash", place.get("slot_14"))
await game.spawnItemOnce("trashbag3", place.get("slot_16"))
await game.spawnItemOnce("plasticbag", place.get("slot_17"))
await game.spawnItemOnce("trashbag4", place.get("slot_22"))
await game.spawnItemOnce("trashbag5", place.get("slot_26"))