place.get('cover').onClick(() => {
    void game.getSound("book_close").play();
    game.navigate('room')
})

await game.spawnItemOnce("shoppinglist", place.get("slot_1"));
await game.spawnItemOnce("invitation", place.get("slot_2"));


//to put papers back in order to read them
const allowedItems = ["invitation", "invitation2", "shoppinglist", "cash", "meme", "recipe_bananabread"];
place.getMany(/slot_\d/).map(slot => {
        slot.onOtherDrop(item => {
            console.log(item)
            if (allowedItems.includes(item.itemName)) {
                console.log("anchored")
                item.anchor(slot)
            }
        })
})

if (game.state.wasDumpsterDiving) {
    await game.spawnItemOnce("recipe_bananabread", place.get("slot_2"));
}
