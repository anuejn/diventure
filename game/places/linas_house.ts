await game.getSound("front_door").play();

place.get('door').onClick(() => {
    void game.getSound("chatting").pause();
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

if (game.state.hadLastDialog) {
    place.get('books').onClick(() => {
        window.open("https://youtu.be/aXByu2iraEA?si=41pXC-2rTudy681J", "_blank");
    })
}

const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
const party1 = itemsInInventory.findIndex(item => item.itemName == "invitation") != -1;
const party2 = itemsInInventory.findIndex(item => item.itemName == "invitation2") != -1;

if (!party1 && !party2) {
    // dialog with lina when the party is not happening:
    place.get('bg_max').hide()
    place.get('bg_nadja').hide()
    place.get('bg_kim').hide()

    place.get('bg_gifts').hide()
    place.get('bg_fruit_salad').hide()
    place.get('bg_drinks').hide()
    place.get('bg_party').hide()
    place.get('bg_party2').hide()
    place.get('bg_discoball').hide()

    /*if (game.state.partyOver) {
        await game.spawnItemOnce("croco", place.get("couch_spot"));
    }*/
    const dialog = place.get("dialog_box_lina_no_party").dialog("right");
    (async () => {
        await place.get("lina").waitClick();
        await dialog.sayOther("Oh hello, I didn't expect you around!");
        await dialog.sayOther("How are you doing?")

        if (!game.state.partyOver) { // this is before the birthday party
            await dialog.answerOptionsLoop({
                "I was just nearby, coming to see if you had some new gossip!": async () => {
                    await dialog.sayOther("Haha, no sorry, not this time!")
                    await dialog.sayOther("That there is a cat at the library now I already told you.")
                    await dialog.sayOther("So no, no entertaining news from me today!")
                    await dialog.sayMe("Ah yes I think I already knew about that!")
                    await dialog.sayMe("Hmm, alright!")
                    await dialog.sayOther("...")
                },
                "I actually have to leave. See you!": async () => {
                    await dialog.sayOther("Alright")
                    await dialog.sayOther("See you soon then I guess!")
                    await dialog.sayMe("Bussi, Baba!")
                    await dialog.sayOther("Baba!")
                    await sleep(2000);
                    await dialog.destroy();
                },
                "Isn't it your birthday soon?": async () => {
                    await dialog.sayOther("Yeah, did you receive my invitation?")
                    await dialog.sayOther("Don't forget to bring it along.")
                    await dialog.sayMe("Yes yes, I'm already very looking forward to it!")
                    await dialog.sayMe("... really excited!")
                    await dialog.sayOther("Great!")
                },
                "Should I bring anything for your party?": async () => {
                    await dialog.sayOther("It would be really nice, if you could bake a cake!")
                    await dialog.sayMe("Great idea, actually funny, 'cause I already wrote the ingrediants on my shopping list.")
                    await dialog.sayOther("Haha funny indeed!")
                }
            });
        } else { // this is after the birthday party
            await dialog.answerOptionsLoop({
                "I was just nearby, coming to see if you had some new gossip!": async () => {
                    await dialog.sayOther("Haha, well yes!")
                    await dialog.sayOther("I went dumpster diving  the other day and found some delicious cookies!")
                    await dialog.sayOther("I remembered you telling me you really liked them!")
                    await dialog.sayOther("... and I have some here for you if you like!")
                    const answerOptions: AnswerOptions = {
                        "*mompf mompf*": async () => {
                            await dialog.sayMe("Ohhh thank you, they are really delicious!")
                        },
                        "Where did you get the cookies from?": async () => {
                            await dialog.sayOther("Just from the market around the corner!");
                            await dialog.sayOther("Their container often holds real TRASHERS!");
                            await dialog.sayMe("Good to know, I think I will also check that one out!");
                            await dialog.sayOther("Great, let me know how it went!")
                        },
                    };
                    if (game.state.triedDumpsterDiving && !game.state.wasDumpsterDiving) {
                        answerOptions["Actually I also tried to go dumpster diving recently..."] = async () => {
                            await dialog.sayMe("... but it didn't go very well!");
                            await dialog.sayMe("The door was locked and I didn't have the right key!");
                            await dialog.sayOther("Oh, what a pitty!")
                            await dialog.sayMe("Yes right?")
                            await dialog.sayOther("Mhmm")
                            await dialog.sayOther("...")
                            if (!game.state.experiencedLocksmithFail) {
                                await dialog.sayOther("I think I actually have the key you need!")
                                await dialog.sayOther("Let me look for it...")
                                await sleep(2000)
                                await dialog.sayOther("...")
                                await sleep(2000)
                                await dialog.sayOther("...")
                                await sleep(2000)
                                await dialog.sayOther("Shit, I can't find it!")
                                await dialog.sayOther("Sorry!")
                                await dialog.sayMe("No worries!")
                            }
                        }
                    }
                    if (game.state.experiencedLocksmithFail && !game.state.wasDumpsterDiving) {
                        answerOptions["I tried getting the key for dumpster diving from a Locksmith!"] = async () => {
                            await dialog.sayMe("... but it failed horribly!")
                            await dialog.sayMe("I was supposed to say some kind of password!")
                            await dialog.sayMe("But the locksmith didn't undestand what I meant!")
                            await sleep(1000)
                            await dialog.sayMe("So he called a colleague to ask for an order...")
                            await dialog.sayMe("...")
                            await dialog.sayMe("... very awkward!")
                            await dialog.sayOther("Ohh haha")
                            await dialog.sayOther("That sounds like a really uncomfortable situation!")
                            await dialog.sayMe("Yes, it was!")
                            await dialog.sayOther("Didn't I tell you that I have the key?")
                            await dialog.sayOther("I must have forgotten!")
                            await dialog.sayOther("Sorry! haha")
                            await dialog.sayOther("You can have my key...")
                            await dialog.sayOther("I even have a spare one!")
                            await game.spawnItem("key", place.get("key_spawn"), { size: "fill" })
                            await dialog.sayMe("What???")
                            await dialog.sayMe("Are you for real?")
                            await dialog.sayMe("Thank youuu!")
                            await dialog.sayOther("Sure, no problem!")
                            await dialog.sayOther("We in the dumpster diving community help together!")
                            await dialog.sayMe("Amazing, now I can finally try it!")
                            await dialog.sayOther("Yes, good luck and have fun!")
                            await sleep(2000)
                            await dialog.destroy()
                        }
                    }
                    await dialog.answerOptionsLoop(answerOptions);
                },
                "Actually, I have to go. See you!": async () => {
                    await dialog.sayOther("See you soon then I guess!")
                    await dialog.sayOther("Baba!")
                    await dialog.sayMe("Baba!")
                    await sleep(2000);
                    await dialog.destroy();
                },
            });
        }
    })();
} else if (party1) {
    place.get('bg_drinks').hide();
    place.get('bg_party2').hide();
    place.get('bg_discoball').hide();
    void game.getSound("chatting").setVolume(0.5).setLoop().play();

    (async () => {
        // start dialog with lina when the party is happening: give her the cake
        const dialog = place.get("dialog_box_lina").dialog("right");
        if ((await place.get("tablespot").anchoredItems()).length == 0) {
            await place.get("lina").waitClick();
            await dialog.sayOther("Hey, really cool you made it to my party!")
            const answerOptions: AnswerOptions = {
                "Sure, thanks for inviting me!": async () => {
                    await dialog.sayOther("Of course!")
                }
            };
            if (itemsInInventory.findIndex(item => item.itemName == "cake") != -1) {
                answerOptions["I brought cake!"] = async () => {
                    await dialog.sayOther("Thank you!");
                    await dialog.sayOther("You can give it to me, so I can put it on the buffet!");
                    const cake = await place.get('lina').waitOtherDrop(item => item.itemName == "cake");
                    await dialog.sayOther("Thanks again!");
                    cake.hide();
                    cake.anchor(place.get("tablespot"))
                    await sleep(1000);
                    cake.show();
                    await sleep(1000);
                    await dialog.sayOther("Have fun at the party!");
                    await sleep(2000);
                    await dialog.destroy();
                }
            } else {
                answerOptions["Oh shit, I forgot to bring cake!"] = async () => {
                    await dialog.sayMe("I will be right back!")
                    await dialog.sayMe("... with cake haha!")
                    await sleep(2000);
                    await dialog.destroy();
                };
            }
            await dialog.answerOptionsLoop(answerOptions)
        }
        if ((await place.get("tablespot").anchoredItems()).length == 0) return;

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
                            await dialog.sayOther("Are you enjoying the game so far?")
                            await dialog.answerOptions({
                                "Not so much. It's too frustrating!": async () => {
                                    await dialog.sayOther("Oh, what a pitty!")
                                    await dialog.sayOther("But I'm sorry I can't really help you with that...")
                                    await dialog.sayOther(`... better <a href="https://github.com/anuejn/diventure/issues", "_blank">complain with the makers<a>!`)
                                    await dialog.sayMe("...")
                                    await dialog.sayOther("...")
                                },
                                "I really like it!": async () => {
                                    await dialog.sayOther("Amazing, glad to hear! :)")
                                },
                                "Too easy!": async () => {
                                    await dialog.sayOther("Oh, ok wow. I will get out of your way then...")
                                    await dialog.sayOther("I am just a side character anyways!")
                                    await dialog.sayMe("...")
                                    await dialog.sayOther("...")
                                },
                                "Why am I even playing this game?": async () => {
                                    await dialog.sayOther("Haha, I fear you have to find out yourself!")
                                    await dialog.sayOther("But thanks for your time!")
                                }
                            })
                        },
                        "Where do you know Lina from?": async () => {
                            await dialog.sayOther("Oh, we got to know each other a few month ago at a cooking event!")
                            await dialog.answerOptions({
                                "That sounds interesting - tell me more about that!": async () => {
                                    await dialog.sayOther("Ahm, it was really great!")
                                    await dialog.sayOther("But in the end we had way too much food left we couldn't eat all ...")
                                    await dialog.sayOther("... and had to throw a lot of it to the trash!")
                                    await dialog.sayMe("Oh no, that sounds really sad!")
                                    await dialog.sayOther("Yes I felt the same!")
                                },
                                "Oh I love cooking! I found this really great recepie recently.": async () => {
                                    await dialog.sayMe("It did involved cooking a celeriac for four full hours in the oven ...")
                                    await dialog.sayMe("But it was really good!")
                                    await dialog.sayOther("Sounds delicious!")
                                    await dialog.sayOther("Do you still have the recepie by any chance?")
                                    await dialog.sayMe("No, but on the internet are tons of recipies!")
                                    //await dialog.sayMe("LINK TO WEBSITE ???")
                                    await dialog.sayOther("Ah, thanks!")
                                },
                            })
                        },
                        "Sorry, I have to go now!": async () => {
                            await dialog.sayOther("Ok, see you around!");
                            await dialog.destroy;
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
                            await dialog.sayOther("...")
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
                                    await dialog.sayOther("...")
                                    place.get("bg_max").hide();
                                    place.get("max").hide();
                                    await dialog.destroy();
                                }
                            })
                        },
                        "I would like to get some food at the buffet!": async () => {
                            await dialog.sayMe("I'm really hungry, my stomache is already making sounds!")
                            await dialog.sayMe("... and maybe I can find something with mint!")

                            await dialog.sayOther("Alright then ...")
                            await dialog.sayOther("Bon Apetit!")
                            await dialog.sayMe("Thanks!")
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
                            await dialog.sayOther("I had a lot of fruit leftovers from my last dumpster tour...")
                            await dialog.sayOther(" ... and thought it would be the perfect snack to bring along.")

                            await dialog.answerOptionsLoop({
                                "Dumpster Diving?": async () => {
                                    await dialog.sayOther("Yea, it's not <i>literally</i> diving.")
                                    await dialog.sayOther("It's basically 'stealing' the food supermarkets throw away.") // weiß ned ob stealing als wort da vorkommen soll!?
                                },
                                "Do you have more leftovers?": async () => {
                                    await dialog.sayOther("Currently I don't, unfortunately.")
                                    await dialog.sayOther("But you could try to go dumpster diving yourself if you're interested!")
                                    await dialog.sayMe("Oh yes, that's a good idea actually!");
                                },
                                "Can you show me how to get such nice fruits?": async () => {
                                    await dialog.sayOther("Sure...")
                                    await dialog.sayOther("Well, actually you just have to be attentative when you are around supermarkets!");
                                    await dialog.sayOther("And here I have a pair of gloves for you!")
                                    await dialog.sayOther("They will come very handy...")
                                    await dialog.sayOther("... when you have to rummage through trash!")
                                    await game.spawnItemOnce("gloves", place.get("gloves_spawn"), { size: "fill" })
                                    await dialog.sayOther("Take them with you!")
                                    await dialog.sayMe("Ah, makes sense!")
                                    await dialog.sayMe("Thanks!")
                                    await dialog.sayMe("I will start checking out the supermarket I always go to!");
                                    await dialog.sayOther("That's for sure a great start!")
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
                            await dialog.sayOther("Yes, it's right back there!")
                            await dialog.sayMe("Ah thanks!")
                            await dialog.sayOther("Nice talking to you!");
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

    // if we collected the gloves, our task at the party is done and we destroy the invitation and the cake
    place.onLeave(async () => {
        const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();
        if (itemsInInventory.findIndex(item => item.itemName == "gloves") != -1) {
            (await game.getItemById("cake")).destroy();
            (await game.getItemById("invitation")).destroy();
            game.state.partyOver = true;
        }
    });

} else if (party2) {
    place.get('bg_gifts').hide();
    place.get('bg_party').hide();
    place.get('bg_fruit_salad').hide()
    void game.getSound("chatting").setVolume(0.5).setLoop().play();

    (async () => {
        // start dialog with lina when the party is happening: give her the banana bread
        const dialog = place.get("dialog_box_lina").dialog("right");
        if ((await place.get("tablespot").anchoredItems()).length == 0) {

            await place.get("lina").waitClick();
            await dialog.sayOther("Hey, really cool you made it to my party another time!")
            const answerOptions: AnswerOptions = {
                "Sure, thanks for inviting me again!": async () => {
                    await dialog.sayMe("I really liked the first one!")
                    await dialog.sayMe("I met really nice people there!")
                    await dialog.sayOther("Glad to hear!")
                    await dialog.sayMe("Yea... ")
                    await dialog.sayMe("... and in the meantime I got into dumpster diving!")
                    await dialog.sayOther("Cool!")
                }
            };
            if (itemsInInventory.findIndex(item => item.itemName == "banana_bread") != -1) {
                answerOptions["I brought banana bread!"] = async () => {
                    await dialog.sayMe("...made of ingrediants I dumpstered myself!")
                    await dialog.sayOther("Oh wow")
                    await dialog.sayOther("Thank you!")
                    await dialog.sayOther("You can give it to me to put it on the buffet!");
                    const cake = await place.get('lina').waitOtherDrop(item => item.itemName == "banana_bread");
                    await dialog.sayOther("I am so proud of you!");
                    cake.hide();
                    cake.anchor(place.get("tablespot"))
                    await sleep(1000);
                    cake.show();
                    await sleep(1000);
                    await dialog.sayMe("Thank you hihi")
                    await dialog.sayOther("You probably have a lot to tell now if someone asks you about dumpster diving!");

                    await dialog.answerOptionsLoop({
                        "At least I can tell a story about an akward funny locksmith situation!": async () => {
                            await dialog.sayOther("Oh yes");
                            await dialog.sayOther("What a fail!");
                        },
                        "Did I tell you that I got into dumpster diving because of Kim?": async () => {
                            await dialog.sayOther("No, you didn't.")
                            await dialog.sayOther("But what a nice ")
                        },
                        "Whats now going to happen?": async () => {
                            await dialog.sayOther("Actually, I have something for you!");
                            await dialog.sayOther("One last time...");
                            await dialog.sayOther("Because you are officially a dumpster diver now...");
                            await dialog.sayOther("...you get a propper <i>diving license</i>")
                            await game.spawnItemOnce("certificate", place.get("info_spot"), { size: "fill" })
                            await dialog.sayMe("Badum tzzz")

                            await sleep(1000);
                            await dialog.sayOther("And you have officially reached the end of this game!")

                            await dialog.answerOptions({
                                "Okay, it was nice talking to you!": async () => {
                                    await dialog.sayOther("Yeah")
                                    await dialog.sayOther("Bye")
                                    await sleep(2000)
                                    await dialog.sayOther("Oh boy, endings are always a bit wiered")
                                    await dialog.sayOther("So maybe this is not the end?")
                                    await dialog.sayMe("But only if I continue to play")
                                    await dialog.sayMe("Muhaha")
                                },
                                "I got really interested into dumpster diving": async () => {
                                    await dialog.sayOther("There is still a lot more to learn about dumpster diving and food waste");
                                    await dialog.sayOther("If, you are interested, you can find some resources in the library")
                                    await dialog.sayMe("Even if the game is officially over?")
                                    await dialog.sayOther("Sure, you can still explore!")
                                    await dialog.sayOther("And take your diving license!")
                                    await dialog.sayOther("... and always remember:")
                                    await dialog.sayOther("Food is only saved once it has been eaten!")
                                    game.state.hadLastDialog = true;
                                    await dialog.destroy()
                                }
                            })
                        },
                    })
                }
            } else {
                answerOptions["Oh shit but I forgot to bring the banana bread I wanted to bake!"] = async () => {
                    await dialog.sayMe("I will be right back!")
                    await dialog.sayMe("With banana bread haha!")
                    await dialog.sayMe("It's a very simple recepie...")
                    await dialog.sayMe("... only flour, sugar, bananas, and some sunflower oil!")
                    await dialog.sayOther("Okay, see you later then!")
                    await sleep(2000);
                    await dialog.destroy();
                };
            }
            await dialog.answerOptionsLoop(answerOptions)
        }
    })();
}