import {rooms, WORLD_WIDTH, WORLD_HEIGHT,randint} from "./generateWorld.js";
import {CANVAS_WIDTH, CANVAS_HEIGHT } from "./render.js";
import {player} from "./entity.js";

const ITEM_SRC_SIZE = 16;

// enum for items
const Item = {
	POTION_RED: 0,
	POTION_DEFENCE: 1,
	POTION_ATTACK: 2,
	POTION_GREEN: 3,
	POTION_PURPLE: 4,
	//WEAPONS
	SWORD: 5,
	POISON_SWORD: 6,
	HATCHET: 7,
	AXE: 8,
	STEEL_SHIELD: 9,
	WOODEN_SHIELD: 10,
	BOW: 11,
	SPEAR: 12,	//add from here
	SCYTHE: 13,
	MACE: 14,
	TRIDENT: 15,
	BAT: 16,
	//WANDS
	LIGHTNING_WAND: 17,
	FIRE_WAND: 18,
	VINE_WAND: 19,
	POISON_WAND: 20,
	//ARMORS
	FIRE_ARMOR: 21,
	BRONZE_ARMOR: 22,
	GREEN_AURA_ARMOR: 23,
	POISON_ARMOR: 24,
	ORANGE_ARMOR: 25,
	BLUE_ARMOR: 26,
	GILDED_ARMOR: 27,
	SHIELD_ARMOR: 28,
	BLACK_ARMOR: 29,
	ICE_ARMOR: 30,
	VINE_ARMOR: 31,
	RAINBOW_ARMOR: 32,
	//lEGGINGS
	POISON_LEGGINGS: 33,
	YELLOW_LEGGINGS: 34,
	BLUE_LEGGINGS: 35,
	WET_LEGGINGS: 36,
	GOLD_LEGGINGS: 37,
	BAG_THINGY: 38,
	BRONZE_LEGGINGS: 39,
	ITEM_MAX: 40,
}

// weapon stats
class ItemStats {
	constructor(damage, shield, mana, special, special_mana, name, cost, directional=false) {
		this.damage = damage;
		this.shield = shield;
		this.name = name;
		this.mana = mana;
		this.special = special;
		this.special_mana = special_mana;
		this.cost = cost;
		this.directional = directional;
	}
}

//weapon stats
const itemStats = [
	new ItemStats(1, 1, 1, 1, 1, "Potion Red", 15),
	new ItemStats(1, 1, 1, 1, 1, "Defense Boost", 13),
	new ItemStats(1, 1, 1, 1, 1, "Attack Boost", 12),
	new ItemStats(1, 1, 1, 1, 1, "Potion Green", 11),
	new ItemStats(1, 1, 1, 1, 1, "Potion Purple", 20),
	new ItemStats(10, 2, 1, 20, 3, "Sword", 5),
	new ItemStats(10, 2, 1, 30, 3, "Poison Sword", 30),
	new ItemStats(20, 1, 1, 40, 3, "Hatchet", 15),
	new ItemStats(30, 1.5, 2, 50, 3, "Axe", 10),
	new ItemStats(4, 20, 2, 10, 4, "Steel Shield", 2),
	new ItemStats(1, 10, 0, 4, 2, "Wooden Shield", 3),
	new ItemStats(10, 1, 1, 15, 2, "Bow", 24),
	new ItemStats(20, 1.5, 1, 40, 2, "Spear", 24),
	// Fill in from here (these items aren't implemented yet)
	new ItemStats(15, 1.5, 2, 20, 3, "Scythe", 24, true),
	new ItemStats(20, 1.5, 1, 40, 2, "Mace", 24),
	new ItemStats(20, 1.5, 1, 40, 2, "Trident", 24),
	new ItemStats(20, 1.5, 1, 40, 2, "Bat", 24),
	new ItemStats(20, 1.5, 1, 40, 2, "Lightning Wand", 24),
	new ItemStats(20, 1.5, 1, 40, 2, "Fire Wand", 24),
	new ItemStats(20, 1.5, 1, 40, 2, "Vine Wand", 24),
	new ItemStats(20, 1.5, 1, 40, 2, "Poison Wand", 24),
	new ItemStats(1, 2, 1, 2, 1, "Fire Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Bronze Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Green Aura Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Poison Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Orange Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Blue Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Gilded Armor", 100),
	new ItemStats(1, 4, 1, 2, 1, "Shield Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Black Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Ice Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Vine Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Rainbow Armor", 100),
	new ItemStats(1, 2, 1, 2, 1, "Poison Leggings", 100),
	new ItemStats(1, 2, 1, 2, 1, "Yellow Leggings", 100),
	new ItemStats(1, 2, 1, 2, 1, "Blue Leggings", 100),
	new ItemStats(1, 2, 1, 2, 1, "Wet Leggings", 100),
	new ItemStats(1, 2, 1, 2, 1, "Gold Leggings", 100),
	new ItemStats(1, 2, 1, 2, 1, "Bag Thingy", 100),
	new ItemStats(1, 2, 1, 2, 1, "Bronze Leggings", 100),
];

function inRange(item, x, y) {
	switch (item) {
		case Item.BOW:
			return Math.abs(x)+Math.abs(y) <= 3;
		case Item.SPEAR:
			return (Math.abs(x) == 1 && Math.abs(y) == 1);
		case Item.SCYTHE:
			return (Math.abs(x) <= 1 && Math.abs(y) <= 1);
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
		case Item.SPEAR:
			return (Math.abs(x) <= 2 && Math.abs(y) == 0) || (Math.abs(x) == 0 && Math.abs(y) <= 2);
		case Item.SCYTHE:
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

let inventory = new Inventory();

class Shop {
	constructor(items) {
		this.items = items;
		this.selected = 0;
		this.open = false
	}

	buy() {
		if (player.coins >= itemStats[this.items[this.selected]].cost) {
			player.coins -= itemStats[this.items[this.selected]].cost
			inventory.add(this.items.splice(this.selected, 1)[0]);
		}
		
	}

	sell() {

	}

	selection_up() {
		if (this.selected > 0)
			this.selected--;
	}

	selection_down() {
		if (this.selected < 5 && this.selected < this.items.length-1)
			this.selected++;
	}
}

export { itemInRoom, items, Inventory, inventory, itemStats, ITEM_SRC_SIZE, inRange, inRangeSpecial, Item, Shop}

