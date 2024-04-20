place.get('cover').onClick(() => {
    game.navigate('room')
})

await game.spawnItemOnce("shoppinglist", place.get("slot_1"));
await game.spawnItemOnce("invitation", place.get("slot_2"));


//to put papers back in order to read them

place.getMany(/slot_\d/).map(slot => {
    //wie kann ma da nach item names abfragem, damit man keine bananen ins buch legen kann?
    //if(){
        slot.onOtherDrop(item => item.anchor(slot))
    //}
})
