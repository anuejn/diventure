place.get('door').onClick(() => {
    game.navigate('room')
})
place.get('fridge').onClick(() => {
    game.navigate('fridge')
})
place.get('upper_closet').onClick(() => {
    game.navigate('upper_closet')
})
place.get('lower_closet').onClick(() => {
    game.navigate('lower_closet')
})

const items = ["flour", "sugar", "chocolate", "eggs"];

const oven = place.get('oven')
oven.onOtherDrop(async item => {
    console.log(item.itemName)
    if (items.includes(item.itemName)) {
        console.log("anchored")
        item.anchor(oven)
    }

    // check if everythimg is there
    const itemsInOven = oven.anchoredItems().map(item => item.itemName);
    if (JSON.stringify(items.sort()) == JSON.stringify(itemsInOven.sort())) {
        for (const item of oven.anchoredItems()) {
            item.destroy()
        }
        game.spawnItemOnce("cake", place.get("oven"))
    }
    
})

