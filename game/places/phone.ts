//game.spawnItemOnce("banana", place.get("slot1"))




place.get("back").onClick(() => {
    //game.getSound("").play();
    game.navigate("backdoor_supermarket");
})

const dialog = place.get("dialog_box").dialog();
(async () => {
    await place.get("home_button").waitClick();

    dialog.sayLeft("Something!");
    await sleep(1000);
    dialog.sayRight("*The hint how to get to the Locksmith*");
    await sleep(1000);
    game.spawnItemOnce("hint_locksmith", place.get("slot"))

})()