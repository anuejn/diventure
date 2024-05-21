place.get('side').onClick(() => {
    void game.getSound("step_back").play();
    game.navigate('map')
})


let try_counter = 0;
const onClickDoor = async () => {
    await game.getSound("door_metal").play();
    game.state.triedDumpsterDiving = true;
    if (try_counter > 2) {
        if (!game.state.hasLocksmithHint) {
            await game.getSound("phone_ring").play();
            await sleep(1500);
            game.navigate('phone')
        }
    } else {
        try_counter += 1;
    }
};

place.get('door').onClick(onClickDoor)
place.get('lock').onClick(onClickDoor)

place.get("lock").onOtherDrop(item => {
    if (item.itemName == "key") {
        game.navigate("trashbins")
    }
})
