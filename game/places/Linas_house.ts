place.get('door').onClick(() => {
    game.navigate('map')
})

place.get('bg_max').hide()
place.get('bg_nadja').hide()
place.get('bg_kim').hide()

place.get('bg_gifts').hide()
place.get('bg_party').hide()


if(game.state.hasInvitation == true && game.state.hasCake == true){
    place.get('bg_max').show()
    place.get('bg_nadja').show()
    place.get('bg_kim').show()
}

let cake_handed = 0;
place.get('bg_lina').onOtherDrop(item => {
    if (item.itemName == "cake") {
        cake_handed = 1;
        item.destroy()
        place.get('bg_party').show()

        place.get('bg_gifts').show()
        game.spawnItem("cake", place.get("tablespot2"))
    }
})


let card_handed = 0;
place.get('bg_lina').onOtherDrop(item => {
    if (item.itemName == "invitation") {
        card_handed = 1;
        item.destroy()
        place.get('bg_max').show()
        place.get('bg_nadja').show()
        place.get('bg_kim').show()
    }
})
