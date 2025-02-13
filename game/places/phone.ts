const dialog = place.get("dialog_box").dialog("right");
(async () => {
    await dialog.sayOther("Hey, it's me, Kim!");
    await dialog.sayOther("Just wanted to say hi!");
    await dialog.sayMe("Oh hey!")
    await dialog.answerOptionsLoop({
        "What's up?": async () => {
            await dialog.sayOther("Oh, not much!")
            await dialog.sayOther("I'm having a pretty lazy day today!")
            await dialog.sayOther("So I thought I'd just give it a try to call you!")
        },
        "What a coincidence you are calling now!": async () => {
            await dialog.sayMe("I am just right now trying to dumpster dive!");
            await dialog.sayMe("But the space where the supermarket has their bins is locked!")
            await dialog.sayOther("Oh yeah, shops in Vienna do that a lot unfortunately!")
            await dialog.answerOptionsLoop({
                "Why on earth would they lock their <i>trash</i>?": async () => {
                    await dialog.sayOther("I think to prevent us from 'stealing' their waste!")
                    await dialog.sayOther("To sell more...")
                    await dialog.sayOther("But honestly, maybe also because they don't want to clean!")
                    await dialog.sayOther("Some people leave the bins in a shitty state and that understandably annoys the supermarkets!")
                    await dialog.sayMe("Ah I see, so it is important to leave the place clean!?")
                    await dialog.sayOther("Exactly!")
                },
                "And how do <i>you</i> get in then?": async () => {
                    await dialog.sayOther("Oh, there is a key!");
                    await dialog.sayOther("The ones usually used by the sanitation workers!")
                    await sleep(1000);
                    await dialog.sayOther("Completely forgot to tell you...");
                    await dialog.answerOptionsLoop({
                        "That sounds Illegal...": async () => {
                            await dialog.sayOther("Well, technically I think so!")
                            await dialog.sayOther("I am not a lawyer though!")
                            await dialog.sayOther(`But I heard that <a href="https://www.zerowasteaustria.at/containern-in-oesterreich.html", "_blank">noone was ever sentenced for dumpsterdiving in austria yet</a>`)
                        },
                        "And where can I get the key from?": async () => {
                            await dialog.sayOther("I heard that you can get it from a locksmith in the 21. District!")
                            await dialog.sayOther(`Just tell them: "I have to pick up keys for Karl"`)
                            await dialog.sayOther("and they will know!")
                            await dialog.sayMe("Oh, ok wow!")
                            await dialog.sayMe("Thank you!")
                            await dialog.sayMe("I will definitely give it a try!")
                            game.state.hasLocksmithHint = true;
                            await sleep(2000);
                            await dialog.sayMe("See you!")
                            await dialog.sayOther("Bye!")
                            await dialog.destroy();
                            game.navigate("backdoor_supermarket");
                        }
                    })
                }
            })
        },
    });
})()
