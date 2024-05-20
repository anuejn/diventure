//game.spawnItemOnce("banana", place.get("slot1"))




place.get("back").onClick(() => {
    //game.getSound("").play();
    game.navigate("backdoor_supermarket");
})

const dialog = place.get("dialog_box").dialog("right");
(async () => {
    await place.get("home_button").waitClick();

    await dialog.sayMe("Something!");
    await dialog.sayOther("*The hint how to get to the Locksmith*");
    game.spawnItemOnce("hint_locksmith", place.get("slot"))

})()