place.get('exit').onClick(() => {
    game.getSound("door_exit").play();
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

    await place.get('dude').waitClick();
    await dialog.sayOther("Hello")
    await dialog.sayOther("How can I help you?")

    const answerOptions: AnswerOptions = {
        "I am just checking out the keychains": async () => {
            await sleep(1000)
            dialog.sayOther("Okay then. Just tell me, when you need something.")
            await place.get('dude').waitClick();
            dialog.blank()
            await dialog.sayOther("How can I help you?")
        },
        "What do you sell here?": async () => {
            await dialog.sayOther("dont you see that?")
            await dialog.sayOther("I am a locksmith.")
            await dialog.sayOther("I make keys!")
            await place.get('dude').waitClick();
            dialog.blank()
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
            dialog.sayMe("Yes!");
            await dialog.sayOther("Wait a minute...");
            await dialog.sayOther("I'll call him");


            const phonolog = place.get("telephone_box").dialog("left");
            await place.get("telephone").waitClick();
            await phonolog.sayOther("Hello");
            await phonolog.sayMe("Oh hello Alex, there is a person picking up an order for Karl, do you know anything about that?");
            await phonolog.sayOther("Hmm no, nothing that I know!");
            await phonolog.sayMe("Ok, thanks! Tchau!");
            await phonolog.sayOther("Tchau!");
            await sleep(2000);
            phonolog.destroy();
        }
    }

    dialog.answerOptionsLoop(answerOptions);
})()
