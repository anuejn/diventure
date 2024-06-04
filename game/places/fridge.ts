place.get("door_handle").onClick(() => {
    void game.getSound("fridge_door").play();
    game.navigate("kitchen")
    void game.getSound("fridge").pause();
})

await game.getSound("fridge").setVolume(0.2).setLoop().play();
place.onLeave(() => {
    void game.getSound("fridge").pause()
})

await game.spawnItemOnce("yogurt", place.get("slot_04"));
await game.spawnItemOnce("oat_milk", place.get("slot_14"));

const fridge_items = ["butter", "eggs", "fruitsalad", "juice", "oat_milk", "yogurt"];
const dialog = place.get("dialog_box").dialog("left");

place.getMany(/slot_\d/).map(slot => {
    slot.onOtherDrop(item => {
        console.log(item)
        if (!fridge_items.includes(item.itemName)) {
            dialog.sayOther("Are you sure you want to put " + item.itemName.toString() + " into the fridge?");
            console.log("anchored")
            item.anchor(slot)
        }
        else{
            console.log("anchored")
            item.anchor(slot)
        }
    })
})
