place.get('cover').onClick(() => {
    void game.getSound("book_close").play();
    game.navigate('library')
})

place.get('robinfoods').onClick(() => {
    window.open("https://robin-foods.org", "_blank");
})

place.get('wastecooking').onClick(() => {
    window.open("https://www.wastecooking.com/#home", "_blank");
})

place.get('quartalsbericht').onClick(() => {
    window.open("https://edm.gv.at/lmw/#/berichte/oeffentlich", "_blank");
})

place.get('isnuguat').onClick(() => {
    window.open("https://www.isnuguat.at", "_blank");
})