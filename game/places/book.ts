place.get('cover').onClick(() => {
    game.navigate('room')
})

await game.spawnItemOnce("shoppinglist", place.get("slot_paper"));
await game.spawnItemOnce("invitation", place.get("slot_invitation"));
