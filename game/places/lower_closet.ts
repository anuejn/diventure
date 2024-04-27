place.getMany(/door\d/).forEach(door=>{
    door.onClick(() => {
        game.navigate('kitchen')
    })
})

place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})