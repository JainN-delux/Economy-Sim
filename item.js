import {rooms, WORLD_WIDTH, WORLD_HEIGHT,randint} from "./generateWorld.js";

//items
const Item = {
	POTION_RED: 1,
	POTION_PINK: 2,
	POTION_ORANGE: 3,
	POTION_YELLOW: 4,
	POTION_GREEN: 5,
}
let items = Array.from({ length: 256 }, () => new Array(256).fill(null));
//ITEM SPAWN (UPTO FIVE IN EACH ROOM)
function itemInRoom() {
	for (let i = 1; i < rooms.length; i++) {
		const number = randint(1, 5); 
		for (let k = 0; k < number; k++) {
			let x = randint(rooms[i].x + 1, rooms[i].x + rooms[i].w-1);
			let y = randint(rooms[i].y + 1 , rooms[i].y + rooms[i].h -1);
			items[y][x] = randint(1, 5);
		}
	}
}

class Inventory {
	constructor() {
		this.items = [];
		this.open = false;
	}

	toggle() {
		this.open = !this.open;
	}

	add(item) {
		this.items.push(item);
	}
}

let inventory = new Inventory();

export { itemInRoom, items, Item, Inventory, inventory }
