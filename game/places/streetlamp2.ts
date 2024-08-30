place.get("side").onClick(() => {
    void game.getSound("step_back").play();
    game.navigate("sidewalk");
})

const allowedItems = ["meme_1", "meme_2","meme_3"];
place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => {
        console.log(item)
        if (allowedItems.includes(item.itemName)) {
            console.log("anchored")
            item.anchor(slot)
        }
    })
})