place.getMany(/door\d/).forEach(door=>{
    door.onClick(() => {
        game.navigate('kitchen')
    })
})

place.get('dishes').onClick(() => {
    game.getSound("plates").play();
})

place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})