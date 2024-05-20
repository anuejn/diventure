place.get("door_handle").onClick(() => {
    game.getSound("fridge_door").play();
    game.navigate("kitchen")
    game.getSound("fridge").pause();
})

game.getSound("fridge").setVolume(0.1).play();

place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})
