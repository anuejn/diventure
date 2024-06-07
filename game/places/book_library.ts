place.get('cover').onClick(() => {
    void game.getSound("book_close").play();
    game.navigate('library')
})

place.get('robinfoods').onClick(() => {
    window.open("https://robin-foods.org", "_blank");
})