import {rooms, WORLD_WIDTH, WORLD_HEIGHT,randint} from "./generateWorld.js";

//items
const Item = {
	POTION_RED: 0,
	POTION_PINK: 1,
	POTION_ORANGE: 2,
	POTION_YELLOW: 3,
	POTION_GREEN: 4,
}
let items = Array.from({ length: 256 }, () => new Array(256).fill(null));
function itemInRoom() {
	for (let i = 0; i < rooms.length; i++) {
		const number = randint(1, 1 + Math.floor(rooms[i].w*rooms[i].h / 61)); 
		for (let k = 0; k < number; k++) {
			let x = randint(rooms[i].x + 1, rooms[i].x + rooms[i].w-1);
			let y = randint(rooms[i].y + 1 , rooms[i].y + rooms[i].h-1);
			items[y][x] = randint(Item.POTION_RED, Item.POTION_GREEN+1);
		}
	}
}

class Inventory {
	constructor() {
		this.items = [];
		this.open = false;
		this.selected = 0;
	}

	toggle() {
		this.open = !this.open;
	}

	add(item) {
		if (this.items.length <= 6*3)
			this.items.push(item);
	}

	remove_selected() {
		inventory.items.splice(inventory.selected, 1);
	}

	selection_up() {
		if (this.selected > 5)
			this.selected -= 6;
	}

	selection_down() {
		if (this.selected < 12)
			this.selected += 6;
	}
	
	selection_left() {
		if (this.selected > 0)
			this.selected -= 1;
	}

	selection_right() {
		if (this.selected < 17)
			this.selected += 1;
	}

	add_quickslot() {
		
	}
}

let inventory = new Inventory();

export { itemInRoom, items, Item, Inventory, inventory }
