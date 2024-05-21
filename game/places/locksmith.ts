place.get('exit').onClick(() => {
    void game.getSound("door_exit").play();
    game.navigate('map')
})


/*
    if (itemsInInventory.findIndex(item => item.itemName == "hint_locksmith") != -1) {
        await sleep(1000);
        dialog.sayLeft("Hello! I'm here to pick up a key! Karl was asking me to get it for him!");
        await sleep(4000);
        dialog.sayOther("Karl?");
        await sleep(1000);
        dialog.sayLeft("Yes!");
        await sleep(1000);
        dialog.sayOther("Ok!? Let me see if I can find anything here on this pile of ordered keys!");
        await sleep(4000);
        dialog.sayOther("Is he maybe a friend of Alex?");
        await sleep(2000);
        dialog.sayLeft("Could be!?");
        await sleep(3000);
        dialog.sayOther("Ok, I'll call him really quick then!");
        await sleep(3000);
        dialog.sayLeft("Alright, ok!");
        await sleep(1000);
        dialog.sayLeft("Ok, but maybe I'm also wrong and I accidentally went to the wrong locksmith!");
        await sleep(5000);
        dialog.sayOther("*on the phone:* Oh hello Alex, there is a person picking up an order for Karl, do you know anything about that?");
        await sleep(7000);
        dialog.sayOther("He says he doesn't know of any order from Karl!")
        await sleep(5000);
        dialog.sayLeft("Ok, well then I probably came to the wrong address for real, I'm sorry to bother!");
        await sleep(6000);
        dialog.sayOther("Hmm, yes there is another locksmith right up the streets next to this pink café!");
        await sleep(2000);
        dialog.sayLeft("Ah, ok thanks! Bye");
        await sleep(2000);
        dialog.sayOther("Bye");
    }*/

const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();


(async () => {
    const dialog = place.get("dialog_box").dialog("left");
    place.get("bg_telephone").hide()

    await place.get('dude').waitClick();
    await dialog.sayOther("Hello")
    await dialog.sayOther("How can I help you?")

    const answerOptions: AnswerOptions = {
        "I am just checking out the keychains": async () => {
            await sleep(1000)
            await dialog.sayOther("Okay, then just let me know, if you need anything!")
            await place.get('dude').waitClick();
            await dialog.blank()
            await dialog.sayOther("How can I help you?")
        },
        "What do you sell here?": async () => {
            await dialog.sayOther("dont you see that?")
            await dialog.sayOther("I am a locksmith.")
            await dialog.sayOther("I make keys!")
            await place.get('dude').waitClick();
            await dialog.blank()
            await dialog.sayOther("How can I help you?")
        },
        "Uh, oh, I actually have to leave": async () => {
            await sleep(1000);
            await dialog.sayOther("Okay then. See you!")
            await sleep(3000);
            await dialog.destroy();
        }
    };

    if (itemsInInventory.findIndex(item => item.itemName == "hint_locksmith") != -1) {
        answerOptions["Hello! I'm here to pick up a key! Karl was asking me to get it for him!"] = async () => {
            await dialog.sayOther("Karl?");
            await sleep(1000);
            await dialog.sayMe("Yes!");
            await sleep(1000);
            await dialog.sayOther("I don't know about any order for Karl...");
            await dialog.sayOther("Ah, but maybe he's a friend of Alex?");
            await dialog.sayOther("He probably knows!");
            await dialog.sayOther("Wait a minute...");
            await dialog.sayOther("I'll call him!");
            await sleep(2000);
            void dialog.blank();
            void dialog.blank();
            void dialog.blank();
            void dialog.blank();
            void dialog.blank();
            await sleep(1000);

            void game.getSound("phonenr_typing").play();
            place.get("bg_telephone").show()
            const phonolog = place.get("phonolog_box").dialog("left");

            await sleep(9000);
            await phonolog.sayOther("Hello?");
            await phonolog.sayMe("Oh hello Alex!");
            await phonolog.sayMe("There is a person picking up an order for Karl, do you know anything about that?");
            await phonolog.sayOther("Hmm, let me think!");
            await phonolog.sayOther("I don't think so, no, nothing that I know of!");
            await phonolog.sayMe("Strange, ok, thanks!");
            await phonolog.sayMe("Tchau!");
            await phonolog.sayOther("Tchau!");
            await sleep(2000);
            void game.getSound("hangup").play();
            await phonolog.destroy();
            place.get("bg_telephone").hide()

            await sleep(2000);
            await dialog.sayOther("He says he doesn't know of any order from Karl!");

            await dialog.answerOptions({
                "Ufff": async () => {
                    await sleep(1000)
                    await dialog.sayOther("...")
                    await dialog.sayMe("...")
                    await dialog.sayMe("Ok, thank you anyways!")
                    await dialog.sayMe("Good bye!")
                    await dialog.sayOther("Good bye!")
                    await sleep(3000)
                    await dialog.destroy()
                },
                "Ahhm, ok?": async () => {
                    await sleep(1000)
                    await dialog.sayOther("...")
                    await dialog.sayMe("...")
                    await dialog.sayMe("Well I guess I actually went to the wrong locksmith after all!")
                    await sleep(2000)
                    await dialog.sayOther("Maybe!")
                    await dialog.sayMe("Good bye!")
                    await dialog.sayOther("Bye, and good luck with your order!")
                    await sleep(3000)
                    await dialog.destroy()
                },
                "Uh, oh, I actually have to leave": async () => {
                    await sleep(1000)
                    await dialog.sayOther("...")
                    await dialog.sayMe("...")
                    await sleep(1000);
                    await dialog.sayOther("Okay then. See you!")
                    await sleep(3000);
                    await dialog.destroy();
                }
            })


        }
    }

    await dialog.answerOptionsLoop(answerOptions);
})()
