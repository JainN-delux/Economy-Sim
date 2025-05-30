import {rooms, WORLD_WIDTH, WORLD_HEIGHT,randint} from "./generateWorld.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, } from "./render.js";


const ITEM_SRC_SIZE = 16;

// enum for items
const Item = {
	POTION_RED: 0,
	POTION_DEFENCE: 1,
	POTION_ATTACK: 2,
	POTION_GREEN: 3,
	POTION_PURPLE: 4,
	SWORD: 5,
	POISON_SWORD: 6,
	HATCHET: 7,
	AXE: 8,
	STEEL_SHIELD: 9,
	WOODEN_SHIELD: 10,
	BOW: 11,
	ARROW: 12,
	KEY: 13,
}

//weapon stats
class ItemStats {
	constructor(damage, shield, mana, special, special_mana, name) {
		this.damage = damage;
		this.shield = shield;
		this.name = name;
		this.mana = mana;
		this.special = special;
		this.special_mana = special_mana;
	}
}

//weapon stats
const itemStats = [
	new ItemStats(1, 1, 1, 1, 1, "Potion Red"),
	new ItemStats(1, 1, 1, 1, 1, "Defense Boost"),
	new ItemStats(1, 1, 1, 1, 1, "Attack Boost"),
	new ItemStats(1, 1, 1, 1, 1, "Potion Green"),
	new ItemStats(1, 1, 1, 1, 1, "Potion Purple"),
	new ItemStats(10, 2, 1, 20, 3, "Sword"),
	new ItemStats(10, 2, 1, 30, 3, "Poison Sword"),
	new ItemStats(20, 1, 1, 40, 4, "Hatchet"),
	new ItemStats(30, 1, 2, 40, 3, "Axe"),
	new ItemStats(4, 20, 2, 1, 4, "Steel Shield"),
	new ItemStats(2, 10, 1, 0.1, 1, "Wooden Shield"),
	new ItemStats(10, 1, 1, 15, 2, "Bow"),
	new ItemStats(2, 1, 1, 1, 1, "Arrow"),
	new ItemStats(1, 1, 1, 1, 1, "Key"),
];

function inRange(item, x, y) {
	switch (item) {
		case Item.BOW:
			return Math.abs(x)+Math.abs(y) <= 3;
		default:
			return Math.abs(x)+Math.abs(y) <= 1;
	}
}

function inRangeSpecial(item, x, y) {
	switch (item) {
		case Item.BOW:
			return Math.abs(x)+Math.abs(y) <= 5;
		case Item.SWORD:
			return (Math.abs(x) <= 1 && Math.abs(y) <= 1);
		case Item.POISON_SWORD:
			return (Math.abs(x) <= 1 && Math.abs(y) <= 1);
		case Item.AXE:
			return (Math.abs(x) <= 1 && Math.abs(y) <= 1);
		default:
			return Math.abs(x)+Math.abs(y) <= 1;
	}
}

//items map array
let items = Array.from({ length: 256 }, () => new Array(256).fill(null));

//place 1to5 items in each room
function itemInRoom() {
	for (let i = 0; i < rooms.length; i++) {
		const number = randint(1, 1 + Math.floor(rooms[i].w*rooms[i].h / 61)); 
		for (let k = 0; k < number; k++) {
			let x = randint(rooms[i].x + 1, rooms[i].x + rooms[i].w-1);
			let y = randint(rooms[i].y + 1 , rooms[i].y + rooms[i].h-1);
			items[y][x] = randint(Item.POTION_RED, Item.POTION_PURPLE+1);
		}
	}
}

class Inventory {
	constructor() {
		this.items = [];
		this.open = false;
		this.selected = 0;
		this.equipped = [];
	}

	toggle() {
		this.open = !this.open;
	}

	add(item) {
		if (this.items.length <= 6*3)
			this.items.push(item);
	}

	remove_selected() {
		return this.items.splice(inventory.selected, 1)[0];
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

}

class Shop {
	constructor() {
		this.items = [];
		this.selected = 0;
		this.open = false
	}
	remove_selected() {
		return this.items.splice(shop.selected, 1)[0];
	}
	selection_up() {
		if (this.selected > 6)
			this.selected --;
	}

	selection_down() {
		if (this.selected < 0)
			this.selected ++;
	}

}


let inventory = new Inventory();


let shop = new Shop();

export { itemInRoom, items, Item, Inventory, inventory, itemStats, ITEM_SRC_SIZE, inRange, inRangeSpecial, shop}

