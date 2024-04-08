place.getMany(/door\d/).forEach(door=>{
    door.onClick(() => {
        game.navigate('kitchen')
    })
})