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


if (!party) {
    // dialog with lina when the party is not happening:
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
} else {
    (async () => {
        // start dialog with lina when the party is happening: give her the cake
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
                // dialog with nadja: sidequest
                place.get("nadja").waitClick().then(async () => {
                    place.get("nadja").offClick();
                    place.get("max").offClick();
                    place.get("kim").offClick();

                    const dialog = place.get("dialog_box_nadja").dialog("right");
                    await dialog.sayOther("Hey!")
                    if (!place.state.know_nadja) {
                        await dialog.sayOther("I am Nadja")
                        place.state.know_nadja = true;
                    }

                    await dialog.answerOptionsLoop({
                        "How are you?": async () => {
                            await dialog.sayOther("I am fine")
                            await dialog.sayOther("How are you?")
                            await dialog.sayOther("Enjoying the game?")
                            await dialog.answerOptions({
                                "Not so much. To frustrating": async () => {
                                    await dialog.sayOther("Oh, thats sad to hear")
                                    await dialog.sayOther("But I cannot help you with that")
                                    await dialog.sayOther(`Better <a href="https://github.com/anuejn/diventure/issues">complain with the makers<a>`)
                                },
                                "I like it": async () => {
                                    await dialog.sayOther("Great to hear :)")
                                },
                                "To easy": async () => {
                                    await dialog.sayOther("Oh, wow. Then I will get out of your way")
                                    await dialog.sayOther("I am actually just a side character")
                                },
                                "Why am I playing this game anyways?": async () => {
                                    await dialog.sayOther("I fear, you have to answer that yourself")
                                    await dialog.sayOther("But thanks for your time!")
                                }
                            })
                        },
                        "Where do you know Lina from?": async () => {
                            await dialog.sayOther("We got to know each other a few month ago at a cooking event")
                            await dialog.answerOptions({
                                "Sounds Interesting! Tell me more!": async () => {
                                    await dialog.sayOther("It was really great")
                                    await dialog.sayOther("But In the end we had far to much food left")
                                    await dialog.sayOther("And had to throw it all away")
                                    await dialog.sayMe("that sounds sad")
                                },
                                "Oh cool. I found this really great recepie recently": async () => {
                                    await dialog.sayMe("It involved cooking a celeriac for 4 full Hours in the Oven")
                                    await dialog.sayMe("But it was really good.")
                                    await dialog.sayOther("Oh that sounds great")
                                    await dialog.sayOther("Do you still have the recepie somewhere?")
                                    await dialog.sayMe("No, but I think it should be easy to find")
                                },
                            })
                        },
                        "I have to go now": async () => {
                            await dialog.sayOther("Okay, see you!")
                        }
                    });

                    await sleep(2000);
                    await dialog.destroy();
                }),

                // dialog with max: sidequest
                place.get("max").waitClick().then(async () => {
                    place.get("nadja").offClick();
                    place.get("max").offClick();
                    place.get("kim").offClick();

                    const dialog = place.get("dialog_box_max").dialog("right");
                    if (!place.state.know_max) {
                        await dialog.sayOther("Nice to meet you!")
                        await dialog.sayOther("My name is Max")
                        place.state.know_max = true;
                    } else {
                        await dialog.sayOther("Hey!")
                    }
                    await dialog.answerOptionsLoop({
                        "You look like someone who likes gardening!": async () => {
                            await dialog.sayOther("I do!")
                            await dialog.sayOther("How did you know?")
                            dialog.answerOptions({
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
                            await dialog.sayMe("Maybe there is something with Mint")
                            await dialog.sayOther("Alright then")
                            await dialog.sayOther("Bon Apetit!")

                            await sleep(2000);
                            await dialog.destroy();
                        }
                    });
                }),

                // dialog with kim: get the actual sticker
                place.get("kim").waitClick().then(async () => {
                    place.get("nadja").offClick();
                    place.get("max").offClick();
                    place.get("kim").offClick();

                    const dialog = place.get("dialog_box_kim").dialog("left");
                    await dialog.sayOther("Whats up?")
                    if (!place.state.know_kim) {
                        await dialog.sayOther("You can call me Kim")
                        place.state.know_kim = true;
                    }

                    await dialog.answerOptionsLoop({
                        "This fruit salad is amazing! Did you make it?": async () => {
                            await dialog.sayOther("Yes")
                            await dialog.sayMe("I haven't had fruit salad in like forever!")
                            await dialog.sayMe("I think the last time I can remember was when ...")
                            await sleep(2000)
                            await dialog.sayMe("...when I was in Kindergarden.")

                            await dialog.sayOther("I have it all the time currently.")
                            await dialog.sayOther("I had a lot of fruit leftovers from my last dumpster tour and thought it could be the perfect snack to bring along.")

                            await dialog.answerOptionsLoop({
                                "Dumpster Diving?": async () => {
                                    await dialog.sayOther("It's not <i>literally</i> diving.")
                                    await dialog.sayOther("Basically 'stealing' the food supermarkets throw away.")
                                },
                                "Do you have more leftovers?": async () => {
                                    await dialog.sayOther("Sadly no currently.")
                                    await dialog.sayOther("But you could try to go dumpster diving yourself")
                                    await dialog.sayMe("Oh yeah, that would be super cool");
                                },
                                "Can you show me how to get such nice fruits?": async () => {
                                    await dialog.sayOther("You just have to be attentative when you are around Supermarkets");
                                    await dialog.sayOther("This sticker will sharpen your senses!")
                                    await game.spawnItem("meme", place.get("meme_spawn"), {size: 'fill'})
                                    await dialog.sayOther("Just take it with you")
                                    await dialog.sayMe("Oh thanks!")
                                    await dialog.sayMe("I will check out my normal supermarket");
                                    await sleep(2000);
                                    await dialog.destroy();
                                }
                            });
                        },
                        "Didn't we see each other on the bike yesterday?": async () => {
                            await dialog.sayOther("Oh yeah I remember");
                            await dialog.sayOther("What a small world!");
                        },
                        "Do you know where the toilet is?": async () => {
                            await dialog.sayOther("Yes")
                            await dialog.sayOther("Back there")
                            await sleep(1000);
                            await dialog.destroy();
                        }
                    });

                    await sleep(2000);
                    await dialog.destroy();
                }),
            ])
        }
    })();
}
