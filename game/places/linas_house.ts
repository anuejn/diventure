place.get('door').onClick(() => {
    game.navigate('map')
    game.getSound("door_handle").play();
})

let light_on = false;
place.get('light').hide()
place.get('bg_lamp').onClick(() => {
    light_on = !light_on;
    place.get('light').show(light_on)
    game.getSound("light_switch").play();
})

const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
const party = itemsInInventory.findIndex(item => item.itemName == "invitation") != -1;


if (party) {
    (async () => {
        const dialog = place.get("dialog_box_lina").dialog();
        if ((await place.get("tablespot2").anchoredItems()).length == 0) {

            await place.get("bg_lina").waitClick();
            await dialog.sayLeft("Hey, cool that you made it to my birthday party!")
            const answerOptions: AnswerOptions = {
                "Thank you, I was very happy, when I got your invitation": async () => {
                    await dialog.sayLeft("You are welcome")
                    delete answerOptions["Thank you, I was very happy, when I got your invitation"];
                }
            };
            if (itemsInInventory.findIndex(item => item.itemName == "cake") != -1) {
                answerOptions["I made you a nice cake!"] = async () => {
                    await dialog.sayLeft("If you give It to me, I will put it on the buffet");
                    const cake = await place.get('bg_lina').waitOtherDrop(item => item.itemName == "cake");
                    await dialog.sayLeft("Thank you so much");
                    cake.hide();
                    cake.anchor(place.get("tablespot2"))
                    await sleep(1000);
                    cake.show();
                    await sleep(1000);
                    await dialog.sayLeft("Have fun at the party!");
                    await sleep(2000);
                    await dialog.destroy();
                }
            } else {
                answerOptions["Oh shit but I forgot to bring cake"] = async () => {
                    await dialog.sayRight("I will be right back")
                    await dialog.sayRight("With a cake!")
                    await sleep(2000);
                    await dialog.destroy();
                };
            }
            while (!dialog.destroyed) {
                await dialog.answerOptions(answerOptions, "right")
            }
        }

        // The real party can start here
    })();
} else {
    place.get('bg_max').hide()
    place.get('bg_nadja').hide()
    place.get('bg_kim').hide()

    place.get('bg_gifts').hide()
    place.get('bg_party').hide()

    const dialog = place.get("dialog_box_lina").dialog();
    (async () => {
        await place.get("bg_lina").waitClick();
        dialog.sayRight("Hii Lina!");
        await sleep(2000);
        dialog.sayLeft("Oh hello, I didn't expect you around! How are you doing?");
        await sleep(4000);
        dialog.sayRight("I am all good! I was just nearby, coming to see if you had some new gossip!");
        await sleep(4000);
        dialog.sayLeft("Haha, no sorry, not this time! That blablabla happend I already told you a while ago! So no, no entertaining news from me today!");
        await sleep(4000);
        dialog.sayRight("I also have nothing exciting to report, but it was nice to see you. See you soon then I guess!");
        await sleep(4000);
        dialog.sayLeft("See you, buy!");
        await sleep(2000);
        dialog.sayRight("Tchau!");
    })()
}
