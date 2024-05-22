place.getMany(/door\d/).forEach(door=>{
    door.onClick(() => {
        game.navigate('kitchen')
        game.getSound("closet_close").play();
    })
})

place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})