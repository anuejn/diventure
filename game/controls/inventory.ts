// initialization
control.addStyles({
    width: '750px',
    height: '130px',
    margin: '20px',
});
control.anchor('right', 'bottom')
control.get('inventory')
    .vanish()
    .addStyles({transition: 'opacity 0.3s'})

// open & close inventory
control.get('backpack')
    .onClick(() => {
        control.get('inventory').show()
        control.get("bg_backpack").setPulse(false)
        game.relayoutAnchors()
    })
control.get('backpack_with_inventory')
    .onMouseOut(() => {
        control.get('inventory').vanish()
        game.relayoutAnchors();
    })


// Drag and Drop
control.get("backpack")
    .onOtherDragStart(item => {
        control.get("bg_backpack").setPulse(true)

        // we make items that are being dragged the size they would be in the backpack.
        const slotRect = control.get("slot1").svgElement.getBoundingClientRect();
        item.addStyles({width: `${slotRect.width}px`, height: `${slotRect.height}px`});
    })
    .onOtherDragEnd(() => control.get("bg_backpack").setPulse(false))
    .onOtherDrop(item => {
        let placed = false;
        for (let i = 1; i <= 6; i++) {
            const slot = control.get(`slot${i}`);
            if (slot.anchoredItems().length == 0) {
                item.anchor(slot, {size: 'fill'});
                placed = true;
                break;
            } 
        }
        if (!placed) {
            console.log("the backpack is full")
        }
        return placed
    })

control.getMany(/slot\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot, {size: 'fill'}))
})

// Starting Inventar
const cash = (await game.loadOrGetItem("cash"));
if (!cash.isAnchored()) {
    cash.anchor(control.get("slot6"), {size: 'fill'})
}