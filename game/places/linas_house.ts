await game.getSound("front_door").play();

place.get('door').onClick(() => {
    game.navigate('map')
    void game.getSound("door_handle").play();
})

let light_on = false;
place.get('light').hide()
place.get('bg_lamp').onClick(() => {
    light_on = !light_on;
    place.get('light').show(light_on)
    void game.getSound("light_switch").play();
})

place.get('books').onClick(() => {
    window.open("https://youtu.be/aXByu2iraEA?si=41pXC-2rTudy681J", "_blank");
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

        if (!game.state.partyOver) { // this is before the birthday party
            await dialog.answerOptionsLoop({
                "I was just nearby, coming to see if you had some new gossip!": async () => {
                    await dialog.sayOther("Haha, no sorry, not this time!")
                    await dialog.sayOther("That Tina is dating Tom now I already told you a while ago.")
                    await dialog.sayOther("So no, no entertaining news from me today!")
                },
                "Actually, I have to go. See you!": async () => {
                    await dialog.sayOther("Tchau!")
                    await dialog.sayOther("See you soon then I guess!")
                    await sleep(2000);
                    await dialog.destroy();
                },
                "Isn't it your Birthday soon?": async () => {
                    await dialog.sayOther("Yeah, I sent you an invitation to bring with you.")
                    await dialog.sayMe("True, I'm already very looking forward to it!")
                },
                "Should I bring anything for your Birthday?": async () => {
                    await dialog.sayOther("It would be so nice, if you could bake a cake!")
                    await dialog.sayMe("Great idea, actually funny, 'cause I already wrote the ingrediants on a shopping list in my notebook.")
                }
            });
        } else { // this is after the birthday party
            await dialog.answerOptionsLoop({
                "I was just nearby, coming to see if you had some new gossip!": async () => {
                    await dialog.sayOther("Haha, yes!")
                    await dialog.sayOther("I went dumpster diving  the other day and found some delicious cookies")
                    await dialog.sayOther("I remembered you telling me you really liked them")
                    await dialog.sayOther("I have some here for you if you like!")
                    const answerOptions : AnswerOptions = {
                        "*mompf mompf*": async () => {
                            await dialog.sayMe("The cookies are really delicious!")
                        },
                        "Where did you get the cookies from?": async () => {
                            await dialog.sayOther("The market around the corner");
                            await dialog.sayOther("Their container often holds  real treasures");
                            await dialog.sayMe("Oh I will check that out!");
                        },
                    };
                    if (game.state.triedDumpsterDiving) {
                        answerOptions["Actually I also tried to go dumpster diving recently"] = async () => {
                            await dialog.sayMe("But it didn't go well");
                            await dialog.sayMe("The Door was locked and I didnt have the right key");
                            await dialog.sayOther("Oh, thats sad")
                            if (!game.state.experiencedLocksmithFail) {
                                await dialog.sayOther("I actually have a key")
                                await dialog.sayOther("Let me look for it...")
                                await sleep(2000)
                                await dialog.sayOther("...")
                                await sleep(2000)
                                await dialog.sayOther("Shit, I cannot find it")
                            }
                        }
                    }
                    if (game.state.experiencedLocksmithFail) {
                        answerOptions["I tried getting a key for dumpster diving from a Locksmith"] = async () => {
                            await dialog.sayMe("But it failed horribly")
                            await dialog.sayMe("I was supposed to say some kind of password")
                            await dialog.sayMe("But the locksmith didn't undestand")
                            await dialog.sayOther("Oh, that sounds like an uncomfortable situation")
                            await dialog.sayMe("It was!")
                            await dialog.sayOther("You can just have my key")
                            await dialog.sayOther("I have a spare one")
                            await game.spawnItem("key", place.get("key_spawn"), {size: "fill"})
                            await dialog.sayMe("Ooh thank you so much")
                            await dialog.sayMe("I will try it!")
                            await sleep(2000)
                            await dialog.destroy()
                        }
                    }
                    await dialog.answerOptionsLoop(answerOptions);
                },
                "Actually, I have to go. See you!": async () => {
                    await dialog.sayOther("Tchau!")
                    await dialog.sayOther("See you soon then I guess!")
                    await sleep(2000);
                    await dialog.destroy();
                },
                /*
                 indeed actually I went dumpster diving  the other day and found some delicious cookies (???)
I remembered you telling me you really liked them, I have some here for you if you like!
ME:  they're delicious *mompf* - where did you say you got them from?
LINA: The market around the corner,... Their container often holds  real treasures.
ME: Could you maybe bring me with you next time?
LINA: Ah yes, I was actually just about to have a look! Follow me!*/
            });
        }
    })();
} else if (party) {
    (async () => {
        // start dialog with lina when the party is happening: give her the cake
        const dialog = place.get("dialog_box_lina").dialog("right");
        if ((await place.get("tablespot2").anchoredItems()).length == 0) {

            await place.get("lina").waitClick();
            await dialog.sayOther("Hey, really cool you made it to my party!")
            const answerOptions: AnswerOptions = {
                "Sure, thanks for inviting me!": async () => {
                    await dialog.sayOther("Of course!")
                }
            };
            if (itemsInInventory.findIndex(item => item.itemName == "cake") != -1) {
                answerOptions["I brought a cake!"] = async () => {
                    await dialog.sayOther("Thank you! You can give it to me to put it on the buffet!");
                    const cake = await place.get('lina').waitOtherDrop(item => item.itemName == "cake");
                    await dialog.sayOther("Thanks again!");
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
                answerOptions["Oh shit but I forgot to bring cake!"] = async () => {
                    await dialog.sayMe("I will be right back!")
                    await dialog.sayMe("With a cake haha!")
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
                    await dialog.sayMe("Hello!")
                    if (!place.state.know_nadja) {
                        await dialog.sayOther("I am Nadja, a friend of Lina!")
                        place.state.know_nadja = true;
                    }

                    await dialog.answerOptionsLoop({
                        "Hi Nadja, how are you?": async () => {
                            await dialog.sayOther("I am great!")
                            await dialog.sayOther("How about you?")
                            await dialog.sayOther("Are you enjoying the game?")
                            await dialog.answerOptions({
                                "Not so much. It's too frustrating!": async () => {
                                    await dialog.sayOther("Oh, what a pitty!")
                                    await dialog.sayOther("Sorry I cannot really help you with that...")
                                    await dialog.sayOther(`... better <a href="https://github.com/anuejn/diventure/issues">complain with the makers<a>!`)
                                },
                                "I really like it!": async () => {
                                    await dialog.sayOther("Amazing, glad to hear :)")
                                },
                                "Too easy!": async () => {
                                    await dialog.sayOther("Oh, ok wow. I will get out of your way then...")
                                    await dialog.sayOther("I am just a side character anyways!")
                                },
                                "Why am I even playing this game?": async () => {
                                    await dialog.sayOther("Haha, I fear you have to find out yourself!")
                                    await dialog.sayOther("But thank you for your time!")
                                }
                            })
                        },
                        "Where do you know Lina from?": async () => {
                            await dialog.sayOther("We got to know each other a few month ago at a cooking event")
                            await dialog.answerOptions({
                                "Sounds interesting - tell me more about it!": async () => {
                                    await dialog.sayOther("It was really great!")
                                    await dialog.sayOther("But in the end we had far too much food left...")
                                    await dialog.sayOther("... and had to throw a lot of it to the trash!")
                                    await dialog.sayMe("Oh no, that sounds really sad!")
                                },
                                "Oh I love cooking! I found this really great recepie recently.": async () => {
                                    await dialog.sayMe("It involved cooking a celeriac for four full hours in the oven")
                                    await dialog.sayMe("But it was really good.")
                                    await dialog.sayOther("Delicious!")
                                    await dialog.sayOther("Do you still have the recepie by any chance?")
                                    await dialog.sayMe("No, but I think it should be easy to find!") // for real ?? hahaha
                                },
                            })
                        },
                        "Sorry, I have to go now": async () => {
                            await dialog.sayOther("Ok, see you!")
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
                        await dialog.sayOther("My name is Max!")
                        place.state.know_max = true;
                    } else {
                        await dialog.sayOther("Hey!")
                    }
                    await dialog.answerOptionsLoop({
                        "You look like somebody who likes gardening!": async () => {
                            await dialog.sayOther("I do? Good guess!")
                            await dialog.sayOther("How did you know?")
                            await dialog.answerOptions({
                                "I also love gardening": async () => {
                                    await dialog.sayOther("Oh great!")
                                    await dialog.sayOther("What is your favourite plant?")
                                    const answer = async () => {
                                        await dialog.sayOther("Uh yeah, that's a nice one!");
                                        await dialog.sayOther("Mine is mint!");
                                    };
                                    await dialog.answerOptions({
                                        "Parsely": answer,
                                        "Sage": answer,
                                        "Rosemary": answer,
                                        "Thyme": answer,
                                    });
                                },
                                "Your hair called you out!": async () => {
                                    await dialog.sayOther("Uh, I get a lot of comments on my hair...")
                                    await dialog.sayOther("not again!")
                                    place.get("bg_max").hide();
                                    place.get("max").hide();
                                    await dialog.destroy();
                                }
                            })
                        },
                        "I want to get some food at the buffet!": async () => {
                            await dialog.sayMe("I'm really hungry, my stomache is already making sounds!")
                            await dialog.sayMe("... and maybe I find something with mint!")
                            await dialog.sayOther("Alright then ...")
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
                    await dialog.sayOther("Hey, whats up?")
                    if (!place.state.know_kim) {
                        await dialog.sayOther("You can call me Kim by the way!")
                        place.state.know_kim = true;
                    }
                    await dialog.sayMe("Hi Kim!")

                    await dialog.answerOptionsLoop({
                        "This fruit salad is amazing! Did you make it?": async () => {
                            await dialog.sayOther("Yes!")
                            await dialog.sayMe("Wow, I haven't had fruit salad in like forever!")
                            await dialog.sayMe("I think the last time I can remember was when ...")
                            await sleep(2000)
                            await dialog.sayMe("... probably when I was in Kindergarden.")

                            await dialog.sayOther("I currently have it on a daily basis.")
                            await dialog.sayOther("I had a lot of fruit leftovers from my last dumpster tour and thought it could be the perfect snack to bring along.")

                            await dialog.answerOptionsLoop({
                                "Dumpster Diving?": async () => {
                                    await dialog.sayOther("It's not <i>literally</i> diving.")
                                    await dialog.sayOther("It's basically 'stealing' the food supermarkets throw away.") // weiß ned ob stealing als wort da vorkommen soll!?
                                },
                                "Do you have more leftovers?": async () => {
                                    await dialog.sayOther("Currently I don't, sadly.")
                                    await dialog.sayOther("But you could try to go dumpster diving yourself if you're interested!")
                                    await dialog.sayMe("Oh yes, good idea actually!");
                                },
                                "Can you show me how to get such nice fruits?": async () => {
                                    await dialog.sayOther("Well, you just have to be attentative when you are around supermarkets!");
                                    await dialog.sayOther("... and this sticker will sharpen your senses!")
                                    await game.spawnItemOnce("meme", place.get("meme_spawn"))
                                    await dialog.sayOther("Just take it with you")
                                    await dialog.sayMe("Ok, thanks!")
                                    await dialog.sayMe("I will check out the supermarket I always go to!");
                                    await sleep(2000);
                                    await dialog.destroy();
                                }
                            });
                        },
                        "Didn't we see each other on the bike yesterday?": async () => {
                            await dialog.sayOther("Ah that was you! Yes I remember!");
                            await dialog.sayOther("Funny, what a small world!");
                        },
                        "Do you know where the toilet is by any chance?": async () => {
                            await dialog.sayOther("Yes, right back there!")
                            await dialog.sayOther("Nice talkimg to you!");
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

// if we collected the meme, our task at the party is done and we destroy the invitation and the cake
place.onLeave(async () => {
    const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
    if (itemsInInventory.findIndex(item => item.itemName == "meme") != -1) {
        (await game.getItemById("cake")).destroy();
        (await game.getItemById("invitation")).destroy();
        game.state.partyOver = true;
    }
});
