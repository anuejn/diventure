place.get("lid").onClick(() => {
    void game.getSound("container").play();
    game.navigate("trashbins");
})

const forbiddenItems = ["gloves", "key"];  // if we drop these items into the bin, we are stuck
place.getMany(/slot_\d\d/).map(slot => {
    slot.onOtherDrop(item => {
        if (forbiddenItems.includes(item.itemName)) return;
        item.anchor(slot)
    })
})

const food_list = ["apple", "banana", "bellpeper", "brezel", "butter", "candy", "chocolate", "eggs", "flour", "honey", "juice", "oat_milk", "oil_olive", "oil_sunflower", "sugar", "yogurt"]
const trash_list = ["appletrash", "bottletrash", "boxtrash", "can", "can2", "futzerl1", "futzerl2", "kanister", "littlepaper", "mirror", "paperbag", "papertrash", "paste", "plasticbag", "toiletpaper"]
const trashbags = ["trashbag1", "trashbag2", "trashbag3", "trashbag4", "trashbag5"]

const slots = []  // there are 27 slots:
for (let i = 1; i <= 27; i++) {
    slots.push(place.get(`slot_${i.toString().padStart(2, "0")}`))
}

const golden_ratio = 1.618033988749894;
const state: Record<string, number> = {};
function blue_choice<T>(list: T[]): T {
    const key = JSON.stringify(list);
    if (!state[key]) state[key] = Math.random();
    state[key] = (state[key] + golden_ratio) % 1.0;
    const idx = Math.round(state[key] * (list.length - 1));
    return list[idx]
}

if (!place.state.spawnedTrash) {
    place.state.spawnedTrash = true;

    await game.spawnItemUnique("banana", blue_choice(slots))
    await game.spawnItemUnique("oil_sunflower", blue_choice(slots))
    for (let i = 0; i < 15; i++) {
        await game.spawnItemUnique(blue_choice(food_list), blue_choice(slots))
    }
    for (let i = 0; i < 12; i++) {
        await game.spawnItemUnique(blue_choice(trash_list), blue_choice(slots))
    }
    for (let i = 0; i < 8; i++) {
        await game.spawnItemUnique(blue_choice(trashbags), blue_choice(slots))
    }
}