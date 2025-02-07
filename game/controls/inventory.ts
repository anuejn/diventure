// initialization
if (window.innerWidth < 1000) {
    control.addStyles({
        width: '400px',
        height: '83px',
        margin: '10px',
    });
} else {
    control.addStyles({
        width: '625px',
        height: '130px',
        margin: '20px',
    });
}
control.anchor('right', 'bottom')
control.get('inventory')
    .hide()
    .addStyles({transition: 'opacity 0.3s'})

// open & close inventory
let show = false;
control.get('backpack')
    .onClick(() => {
        show = !show;
        control.get('inventory').show(show)
        control.get("bg_backpack").setPulse(false)
        void game.relayoutAnchors()
    })
control.get('backpack_with_inventory')
    .onMouseOut(() => {
        show = false;
        control.get('inventory').hide()
        void game.relayoutAnchors();
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
    .onOtherDrop(async item => {
        for (let i = 1; i <= 6; i++) {
            const slot = control.get(`slot${i}`);
            if ((await slot.anchoredItems()).length == 0) {
                item.anchor(slot, {size: 'fill'});
                break;
            } 
        }
        if (!item.isAnchored()) {
            console.log("the backpack is full")
        }
        void game.getSound("drop").play(); // vamos ver!
    })

control.getMany(/slot\d/).map(slot => {
    slot.onOtherDrop(item => item.anchor(slot, {size: 'fill'}))
})

// Starting Inventar
await game.spawnItemOnce("cash", control.get("slot6"), {size: 'fill'});