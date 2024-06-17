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

place.get('ministerium').onClick(() => {
    window.open("https://www.bmk.gv.at/themen/klima_umwelt/abfall/abfallvermeidung/lebensmittel.html", "_blank");
})

place.get('sdgen').onClick(() => {
    window.open("https://champions123.org/target-123", "_blank");
})

place.get('sdgde').onClick(() => {
    window.open("https://champions123.org/target-123", "_blank");
})

place.get('awarenessday').onClick(() => {
    window.open("https://www.un.org/en/observances/end-food-waste-day", "_blank");
})

place.get('legality').onClick(() => {
    window.open("https://www.zerowasteaustria.at/containern-in-oesterreich.html", "_blank");
})

place.get('cityVienna').onClick(() => {
    window.open("https://www.wien.gv.at/umweltschutz/abfall/lebensmittel/fakten.html", "_blank");
})
