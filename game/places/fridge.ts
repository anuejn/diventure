place.get("door_handle").onClick(() => {
    void game.getSound("fridge_door").play();
    game.navigate("kitchen")
    void game.getSound("fridge").pause();
})

await game.getSound("fridge").setVolume(0.1).play();

place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot))
})
