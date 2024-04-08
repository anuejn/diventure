

(await game.loadItem("banana"))
    .place(place.get("slot1"))
    .draggable("banana_shape");

place.getMany(/slot\d/).map(slot => {
    slot
        .hide()
        .onOtherDragStart(() => slot.show())
        .onOtherDragEnd(() => slot.hide())
        .onOtherDrop(item => item.place(slot))
})
