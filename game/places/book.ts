place.get('cover').onClick(() => {
    game.getSound("book_close").play();
    game.navigate('room')
})

await game.spawnItemOnce("shoppinglist", place.get("slot_1"));
await game.spawnItemOnce("invitation", place.get("slot_2"));


//to put papers back in order to read them
const allowedItems = ["invitation", "shoppinglist", "cash", "meme"];
place.getMany(/slot_\d/).map(slot => {
        slot.onOtherDrop(item => {
            console.log(item)
            if (allowedItems.includes(item.itemName)) {
                console.log("anchored")
                item.anchor(slot)
            }
        })
})
