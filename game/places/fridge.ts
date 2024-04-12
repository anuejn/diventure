place.get("door_handle").onClick(() => {
    game.navigate("kitchen")
})


place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})
