await game.getSound("front_door").play();

place.get('door').onClick(() => {
    game.navigate('map')
    void game.getSound("door_handle").play();
})

let light_on = false;
place.get('lights').hide()
place.get('light_switch').onClick(() => {
    light_on = !light_on;
    place.get('lights').show(light_on)
    void game.getSound("light_switch").play();
})

place.get('cat').onClick(() => {
    void game.getSound("cat").setVolume(10).play();
    const dialog = place.get("dialog_cat").dialog("right");
    (async () => {
        await dialog.sayOther("Mauuu")
        await dialog.sayOther("You found the Library!")
        await dialog.sayOther("This is a bonus place, where you can find more resources about dumpster diving if you want")
        await dialog.sayOther("Feel free to make yourself comfortable and be curious!")
        await sleep(1000);
        await dialog.destroy();
    })()
})

place.get('tv').onClick(() => {
    game.navigate('tv');
})

place.get('books').onClick(() => {
    void game.getSound("book").play();
    game.navigate("book_library");
})
