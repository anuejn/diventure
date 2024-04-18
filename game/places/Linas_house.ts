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




/*
place.get('cake').onClick(() => {
    place.get('bg_cake').hide()
    console.log("hallo")
})


*/