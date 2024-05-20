place.get('exit').onClick(() => {
    game.getSound("door_exit").play();
    game.navigate('map')
})

const itemsInInventory = await game.controls['inventory'].get('backpack_with_inventory').anchoredItemsRecursive();

const dialog = place.get("dialog_box").dialog();
(async () => {
    await place.get('dude').waitClick();
    await dialog.sayRight("Hello")


    let dialogGoesOn = true;
    const answerOptions: AnswerOptions = {
        "I am actually just checking out these cute keychains!": async () => {
            game.getSound("key_chain").play();
            await sleep(1000)
            dialog.sayRight("Okay then just let me know, if you need anything.")
            await place.get('dude').waitClick();
            dialog.blank()
            delete answerOptions["I am actually just checking out these cute keychains!"];
        },
        "What do you sell here?": async () => {
            await dialog.sayRight("Don't you see that?")
            await dialog.sayRight("I am a locksmith... ")
            await dialog.sayRight("I make keys!")
            await sleep(3000);
            dialog.blank()
            delete answerOptions["What do you sell here?"];
        },
        "Uh, oh sorry, I have to leave": async () => {
            dialogGoesOn = false;
            await sleep(1000)
            await dialog.sayRight("Okay then. Good bye!")
        }

    }

    if (itemsInInventory.findIndex(item => item.itemName == "hint_locksmith") != -1) {
        answerOptions["Hello! I'm here to pick up a key! Karl was asking me to get it for him!"] = async () => {
            await dialog.sayLeft("Karl?");
            await sleep(1000);
            dialog.sayLeft("Yes!");



        }
    }

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


    const phonolog = place.get("telephone_box").dialog();
    (async () => {
        await place.get("telephone").waitClick();
        await phonolog.sayRight("Hello");
        await phonolog.sayLeft("Oh hello Alex, there is a person picking up an order for Karl, do you know anything about that?");
        await phonolog.sayRight("Hmm no, nothing that I know!");
        await phonolog.sayLeft("Ok, thanks! Tchau!");
        await phonolog.sayRight("Tchau!");
    })

    while (dialogGoesOn) {
        await dialog.sayRight("How can I help you?")
        await dialog.answerOptions(answerOptions);
    }
})()
