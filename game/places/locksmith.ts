place.get('exit').onClick(() => {
    game.getSound("door_exit").play();
    game.navigate('map')
})
/*
let got_hint = true;
const dialog = place.dialog(place.get("dialog_box"));
(async () => {
    await place.get("dude").waitClick();

    if(got_hint){
        dialog.sayRight("Hello!");
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
    }
    else{
        dialog.sayRight("Hello!");
        await sleep(1000);
        dialog.sayLeft("Hello!");
        await sleep(1000);
        dialog.sayLeft("These key chains are really cute!");
        game.getSound("key_chain").play();
        await sleep(1000);
        dialog.sayRight("Right!? I think so too, I just got them in recently!");
    }
})()

*/
const dialog = place.get("dialog_box").dialog();
(async () => {
    await place.get('dude').waitClick();
    dialog.sayRight("Hello")
    await sleep(1000)

    let dialogGoesOn = true;
    const answerOptions: Record<string, () => void> = {
        "I am just checking out the keychains": async () => {
            await sleep(1000)
            dialog.sayRight("Okay then. Just tell me, when you need something.")
            await place.get('dude').waitClick();
            delete answerOptions["I am just checking out the keychains"];
        },
        "What do you sell here?": async () => {
            await sleep(1000)
            dialog.sayRight("dont you see that?")
            await sleep(1000)
            dialog.sayRight("I am a locksmith.")
            await sleep(1000)
            dialog.sayRight("I make keys!")
            await sleep(3000);
            delete answerOptions["What do you sell here?"];
        },
        "Uh, oh, I actually have to leave": async () => {
            dialogGoesOn = false;
            await sleep(1000)
            dialog.sayRight("Okay then. See you!")
        }
    };
    while (dialogGoesOn) {
        dialog.sayRight("How can I help you?")
        await sleep(1000)
        await dialog.answerOptions(answerOptions);
    }
})()
