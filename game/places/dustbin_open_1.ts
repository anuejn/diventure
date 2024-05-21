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

//there are 27 slots:

await game.spawnItemOnce("futzerl1", place.get("slot_01"))
await game.spawnItemOnce("can", place.get("slot_02"))
await game.spawnItemOnce("boxtrash", place.get("slot_03"))
await game.spawnItemOnce("appletrash", place.get("slot_04"))
await game.spawnItemOnce("trashbag2", place.get("slot_05"))
await game.spawnItemOnce("can2", place.get("slot_06"))
await game.spawnItemOnce("futzerl2", place.get("slot_07"))
await game.spawnItemOnce("trashbag1", place.get("slot_08"))
await game.spawnItemOnce("kanister", place.get("slot_09"))
await game.spawnItemOnce("littlepaper", place.get("slot_10"))
await game.spawnItemOnce("milktrash", place.get("slot_11"))
await game.spawnItemOnce("mirror", place.get("slot_12"))
await game.spawnItemOnce("paperbag", place.get("slot_13"))
await game.spawnItemOnce("papertrash", place.get("slot_14"))
await game.spawnItemOnce("paste", place.get("slot_15"))
await game.spawnItemOnce("trashbag3", place.get("slot_16"))
await game.spawnItemOnce("plasticbag", place.get("slot_17"))
await game.spawnItemOnce("toiletpaper", place.get("slot_18"))
await game.spawnItemOnce("bottletrash", place.get("slot_19"))
await game.spawnItemOnce("banana", place.get("slot_20"))
await game.spawnItemOnce("appletrash", place.get("slot_21"))
await game.spawnItemOnce("trashbag4", place.get("slot_22"))
await game.spawnItemOnce("trashbag5", place.get("slot_26"))

