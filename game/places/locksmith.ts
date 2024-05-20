place.get('exit').onClick(() => {
    game.getSound("door_exit").play();
    game.navigate('map')
})


/*
    if (itemsInInventory.findIndex(item => item.itemName == "hint_locksmith") != -1) {
        await sleep(1000);
        dialog.sayLeft("Hello! I'm here to pick up a key! Karl was asking me to get it for him!");
        await sleep(4000);
        dialog.sayRight("Karl?");
        await sleep(1000);
        dialog.sayLeft("Yes!");
        await sleep(1000);
        dialog.sayRight("Ok!? Let me see if I can find anything here on this pile of ordered keys!");
        await sleep(4000);
        dialog.sayRight("Is he maybe a friend of Alex?");
        await sleep(2000);
        dialog.sayLeft("Could be!?");
        await sleep(3000);
        dialog.sayRight("Ok, I'll call him really quick then!");
        await sleep(3000);
        dialog.sayLeft("Alright, ok!");
        await sleep(1000);
        dialog.sayLeft("Ok, but maybe I'm also wrong and I accidentally went to the wrong locksmith!");
        await sleep(5000);
        dialog.sayRight("*on the phone:* Oh hello Alex, there is a person picking up an order for Karl, do you know anything about that?");
        await sleep(7000);
        dialog.sayRight("He says he doesn't know of any order from Karl!")
        await sleep(5000);
        dialog.sayLeft("Ok, well then I probably came to the wrong address for real, I'm sorry to bother!");
        await sleep(6000);
        dialog.sayRight("Hmm, yes there is another locksmith right up the streets next to this pink café!");
        await sleep(2000);
        dialog.sayLeft("Ah, ok thanks! Bye");
        await sleep(2000);
        dialog.sayRight("Bye");
    }*/

const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();

(async () => {
    const dialog = place.get("dialog_box").dialog();

    await place.get('dude').waitClick();
    await dialog.sayRight("Hello")
    await dialog.sayRight("How can I help you?")

    const answerOptions: AnswerOptions = {
        "I am just checking out the keychains": async () => {
            await sleep(1000)
            dialog.sayRight("Okay then. Just tell me, when you need something.")
            await place.get('dude').waitClick();
            dialog.blank()
            await dialog.sayRight("How can I help you?")
        },
        "What do you sell here?": async () => {
            await dialog.sayRight("dont you see that?")
            await dialog.sayRight("I am a locksmith.")
            await dialog.sayRight("I make keys!")
            await place.get('dude').waitClick();
            dialog.blank()
            await dialog.sayRight("How can I help you?")
        },
        "Uh, oh, I actually have to leave": async () => {
            await sleep(1000);
            await dialog.sayRight("Okay then. See you!")
            await sleep(3000);
            await dialog.destroy();
        }
    };

    if (itemsInInventory.findIndex(item => item.itemName == "hint_locksmith") != -1) {
        answerOptions["Hello! I'm here to pick up a key! Karl was asking me to get it for him!"] = async () => {
            await dialog.sayLeft("Karl?");
            await sleep(1000);
            dialog.sayLeft("Yes!");
            await dialog.sayLeft("Wait a minute...");
            await dialog.sayLeft("I'll call him");


            const phonolog = place.get("telephone_box").dialog();
            await place.get("telephone").waitClick();
            await phonolog.sayRight("Hello");
            await phonolog.sayLeft("Oh hello Alex, there is a person picking up an order for Karl, do you know anything about that?");
            await phonolog.sayRight("Hmm no, nothing that I know!");
            await phonolog.sayLeft("Ok, thanks! Tchau!");
            await phonolog.sayRight("Tchau!");
            await sleep(2000);
            phonolog.destroy();
        }
    }

    dialog.answerOptionsLoop(answerOptions);
})()
