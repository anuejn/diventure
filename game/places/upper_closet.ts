place.getMany(/door\d/).forEach(door=>{
    door.onClick(() => {
        game.getSound("closet_close").play();
        game.navigate('kitchen')
    })
})

place.get('dishes').onClick(() => {
    void game.getSound("plates").play();
})

place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})