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
            await dialog.answerOptionsLoop(answerOptions)
        }

        // The real party can start here
    })();
} else {
    place.get('bg_max').hide()
    place.get('bg_nadja').hide()
    place.get('bg_kim').hide()

    place.get('bg_gifts').hide()
    place.get('bg_party').hide()

    const dialog = place.get("dialog_box_lina_no_party").dialog();
    (async () => {
        await place.get("bg_lina").waitClick();
        await dialog.sayLeft("Oh hello, I didn't expect you around!");
        await dialog.sayLeft("How are you doing?")
        await dialog.answerOptionsLoop({
            "I was just nearby, coming to see if you had some new gossip!": async () => {
                await dialog.sayLeft("Haha, no sorry, not this time")
                await dialog.sayLeft("That Tina now dates Tom, I already told you a while ago")
                await dialog.sayLeft("So no, no entertaining news from me today")
            },
            "Actually, I have to go. See you!": async () => {
                await dialog.sayLeft("Tchau!")
                await dialog.sayLeft("See you soon then I guess")
                await sleep(2000);
                await dialog.destroy();

            }, 
            "Don't you have Birthday soon?": async () => {
                await dialog.sayLeft("Yeah, I send you an invitation. Just bring it to the party.")
                await dialog.sayRight("Sure, looking forward to it")
            },
            "Should I bring anything for your Birthday?": async () => {
                await dialog.sayLeft("It would be so nice, if you could make a cake")
                await dialog.sayRight("Ill do that. I already wrote a shopping list in my book.")
            }
        });
    })()
}
