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
        const dialog = place.get("dialog_box_lina").dialog("right");
        if ((await place.get("tablespot2").anchoredItems()).length == 0) {

            await place.get("lina").waitClick();
            await dialog.sayOther("Hey, cool that you made it to my birthday party!")
            const answerOptions: AnswerOptions = {
                "Thank you, I was very happy, when I got your invitation": async () => {
                    await dialog.sayOther("You are welcome")
                }
            };
            if (itemsInInventory.findIndex(item => item.itemName == "cake") != -1) {
                answerOptions["I made you a nice cake!"] = async () => {
                    await dialog.sayOther("If you give It to me, I will put it on the buffet");
                    const cake = await place.get('lina').waitOtherDrop(item => item.itemName == "cake");
                    await dialog.sayOther("Thank you so much");
                    cake.hide();
                    cake.anchor(place.get("tablespot2"))
                    await sleep(1000);
                    cake.show();
                    await sleep(1000);
                    await dialog.sayOther("Have fun at the party!");
                    await sleep(2000);
                    await dialog.destroy();
                }
            } else {
                answerOptions["Oh shit but I forgot to bring cake"] = async () => {
                    await dialog.sayMe("I will be right back")
                    await dialog.sayMe("With a cake!")
                    await sleep(2000);
                    await dialog.destroy();
                };
            }
            await dialog.answerOptionsLoop(answerOptions)
        }

        // The real party starts here
        while (true) {
            await Promise.any([
                place.get("nadja").waitClick().then(async () => {
                    place.get("nadja").offClick();
                    place.get("max").offClick();
                    place.get("kim").offClick();

                    const dialog = place.get("dialog_box_nadja").dialog("right");
                    await dialog.sayOther("Hey!")
                    await dialog.sayOther("I am Nadja")

                    await dialog.answerOptions({
                        "How are you?": async () => {
                            dialog
                        },
                        "Where do you know Lina from?": async () => {

                        },
                    });

                    await sleep(2000);
                    await dialog.destroy();
                }),
                place.get("max").waitClick().then(async () => {
                    place.get("nadja").offClick();
                    place.get("max").offClick();
                    place.get("kim").offClick();

                    const dialog = place.get("dialog_box_max").dialog("right");
                    await dialog.sayOther("Nice to meet you!")
                    await dialog.sayOther("My name is Max")
                    await dialog.answerOptionsLoop({
                        "You look like someone who likes gardening!": async () => {
                            await dialog.sayOther("I do!")
                            await dialog.sayOther("How did you know?")
                            await dialog.answerOptions({
                                "I also love gardening": async () => {
                                    await dialog.sayOther("Thats so cool!")
                                    await dialog.sayOther("What is your favourite plant?")
                                    const answer = async () => {
                                        await dialog.sayOther("Uh yeah, that is a nice one!");
                                        await dialog.sayOther("Mine is Mint");
                                    };
                                    await dialog.answerOptions({
                                        "Parsely": answer,
                                        "Sage": answer,
                                        "Rosemary": answer,
                                        "Thyme": answer,
                                    });
                                },
                                "Your hair called you out": async () => {
                                    await dialog.sayOther("Uh, I get a lot of comments about my hair!")
                                    await dialog.sayOther("Not again!")
                                    place.get("bg_max").hide();
                                    place.get("max").hide();
                                    await dialog.destroy();
                                }
                            })
                        },
                        "I want to get some food at the buffet": async () => {
                            await dialog.sayOther("Alright then")
                            await dialog.sayOther("Bon Apetit!")

                            await sleep(2000);
                            await dialog.destroy();
                        }
                    });
                }),
                place.get("kim").waitClick().then(async () => {
                    place.get("nadja").offClick();
                    place.get("max").offClick();
                    place.get("kim").offClick();

                    const dialog = place.get("dialog_box_kim").dialog("left");
                    await dialog.sayOther("Whats up?")
                    await dialog.sayOther("You can call me Kim")

                    await sleep(2000);
                    await dialog.destroy();
                }),
            ])
        }
    })();
} else {
    place.get('bg_max').hide()
    place.get('bg_nadja').hide()
    place.get('bg_kim').hide()

    place.get('bg_gifts').hide()
    place.get('bg_party').hide()

    const dialog = place.get("dialog_box_lina_no_party").dialog("right");
    (async () => {
        await place.get("lina").waitClick();
        await dialog.sayOther("Oh hello, I didn't expect you around!");
        await dialog.sayOther("How are you doing?")
        await dialog.answerOptionsLoop({
            "I was just nearby, coming to see if you had some new gossip!": async () => {
                await dialog.sayOther("Haha, no sorry, not this time")
                await dialog.sayOther("That Tina now dates Tom, I already told you a while ago")
                await dialog.sayOther("So no, no entertaining news from me today")
            },
            "Actually, I have to go. See you!": async () => {
                await dialog.sayOther("Tchau!")
                await dialog.sayOther("See you soon then I guess")
                await sleep(2000);
                await dialog.destroy();

            },
            "Don't you have Birthday soon?": async () => {
                await dialog.sayOther("Yeah, I send you an invitation. Just bring it to the party.")
                await dialog.sayMe("Sure, looking forward to it")
            },
            "Should I bring anything for your Birthday?": async () => {
                await dialog.sayOther("It would be so nice, if you could make a cake")
                await dialog.sayMe("Ill do that. I already wrote a shopping list in my book.")
            }
        });
    })()
}
