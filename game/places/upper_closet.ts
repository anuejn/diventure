place.getMany(/door\d/).forEach(door=>{
    door.onClick(() => {
        void game.getSound("closet_close").play();
        game.navigate('kitchen')
    })
})

place.get('dishes').onClick(async () => {
    void game.getSound("plates").play();
    const itemsInInventory = (await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive()).map(x => x.itemName);
    if (["flour", "sugar", "chocolate", "eggs", "butter"].some(x => itemsInInventory.includes(x))) {
        const dialog = place.get("dialog_dishes").dialog("right");
        await dialog.sayOther("Psst...")
        await dialog.sayOther("We are actually just part of the static drawing")
        await dialog.sayOther("In this game you dont need to prepare dough")
        await dialog.sayOther("Just put everything in the oven!")
        await sleep(1000)
        await dialog.destroy()
    }
})

place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})