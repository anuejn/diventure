place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})

place.get("lid").onClick(() => {
    void game.getSound("container").play();
    game.navigate("trashbins");
})

//var food_list = ["apple", "banana", "bellpeper", "brezel", "butter", "candy", "chocolate", "eggs", "flour", "honey", "juice", "oat_milk", "oil_olive", "oil_sunflower", "sugar", "yogurt"]
//var trash_list = ["appletrash", "bottletrash", "boxtrash", "can", "can2", "futzerl2", "futzerl2", "kanister", "littlepaper", "mirror", "paperbag", "papertrash", "paste", "plasticbag", "toiletpaper", "trashbag1", "trashbag2", "trashbag3", "trashbag4", "trashbag5"]

//there are 27 slots:
if (!place.state.spawnedTrash) {
    place.state.spawnedTrash = true;
    await game.spawnItemUnique("futzerl1", place.get("slot_01"))
    await game.spawnItemUnique("can", place.get("slot_02"))
    await game.spawnItemUnique("boxtrash", place.get("slot_03"))
    await game.spawnItemUnique("appletrash", place.get("slot_04"))
    await game.spawnItemUnique("trashbag2", place.get("slot_05"))
    await game.spawnItemUnique("can2", place.get("slot_06"))
    await game.spawnItemUnique("futzerl2", place.get("slot_07"))
    await game.spawnItemUnique("trashbag1", place.get("slot_08"))
    await game.spawnItemUnique("kanister", place.get("slot_09"))
    await game.spawnItemUnique("littlepaper", place.get("slot_10"))
    await game.spawnItemUnique("honey", place.get("slot_11"))
    await game.spawnItemUnique("mirror", place.get("slot_12"))
    await game.spawnItemUnique("paperbag", place.get("slot_13"))
    await game.spawnItemUnique("papertrash", place.get("slot_14"))
    await game.spawnItemUnique("paste", place.get("slot_15"))
    await game.spawnItemUnique("trashbag3", place.get("slot_16"))
    await game.spawnItemUnique("plasticbag", place.get("slot_17"))
    await game.spawnItemUnique("toiletpaper", place.get("slot_18"))
    await game.spawnItemUnique("bottletrash", place.get("slot_19"))
    await game.spawnItemUnique("banana", place.get("slot_20"))
    await game.spawnItemUnique("appletrash", place.get("slot_21"))
    await game.spawnItemUnique("trashbag4", place.get("slot_22"))
    await game.spawnItemUnique("apple", place.get("slot_23"))
    await game.spawnItemUnique("bellpeper", place.get("slot_24"))
    await game.spawnItemUnique("brezel", place.get("slot_25"))
    await game.spawnItemUnique("trashbag5", place.get("slot_26"))
    await game.spawnItemUnique("candy", place.get("slot_27"))
}