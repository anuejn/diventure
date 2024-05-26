const dialog = place.get("dialog_box").dialog("right");
(async () => {
    await dialog.sayOther("Hey, its me, kim!");
    await dialog.sayOther("Just wanted to say hi");
    await dialog.sayMe("Oh hey!")
    await dialog.answerOptionsLoop({
        "Oh cool, whats up?": async () => {
            await dialog.sayOther("Not much")
            await dialog.sayOther("Having a pretty lazy day today")
            await dialog.sayOther("So I thought I'd just give it a try to call you")
        },
        "What a coincidence, that you call now": async () => {
            await dialog.sayMe("I am just trying to dumpster dive");
            await dialog.sayMe("But the space where the supermarket has their bins is locked")
            await dialog.sayOther("Oh yeah, shops in vienna do that a lot sadly")
            await dialog.answerOptionsLoop({
                "Why on earth do they lock their <i>trash</i>?": async () => {
                    await dialog.sayOther("I think to prevent us from 'stealing' their waste")
                    await dialog.sayOther("To sell more")
                    await dialog.sayOther("But honestly, maybe also because they dont want to clean")
                    await dialog.sayOther("Some people leave the bins in a shitty state and that understandably annoys the supermarkets")
                    await dialog.sayMe("Ah I see, so it is important to leave the place clean")
                    await dialog.sayOther("Exactly!")
                },
                "And how do <i>you</i> get in then?": async () => {
                    await dialog.sayOther("Oh, I have a key");
                    await dialog.sayOther("The ones usually used by the sanitation workers")
                    await sleep(1000);
                    await dialog.sayOther("Completely forgot to tell you");
                    await dialog.answerOptionsLoop({
                        "That sounds Illegal...": async () => {
                            await dialog.sayOther("Well, technically I think so")
                            await dialog.sayOther("I am not a lawyer")
                            await dialog.sayOther(`But I heard that <a href="https://www.zerowasteaustria.at/containern-in-oesterreich.html">noone was sentenced for dumpsterdiving in austria yet</a>`)
                        },
                        "And where did you get your key from": async () => {
                            await dialog.sayOther("I got it from a locksmith in the 21. District")
                            await dialog.sayOther("You can probably also get one from there")
                            await dialog.sayOther(`Just say "I have to pick up keys for Karl"`)
                            await dialog.sayOther("And they will know")
                            await dialog.sayMe("Thank you so much!")
                            await dialog.sayMe("I will try that")
                            game.state.hasLocksmithHint = true;
                            await sleep(2000);
                            await dialog.sayMe("See you!")
                            await dialog.sayOther("See you!")
                            await dialog.destroy();
                            game.navigate("backdoor_supermarket");
                        }
                    })
                }
            })
        },
    });
})()
