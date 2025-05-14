import { isWalkable, tiles } from "./generateWorld.js";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, TILE_SIZE, entitysheet, itemset, damageMarkers } from "./render.js";
import { items, Item, itemStats, ITEM_SRC_SIZE } from "./item.js";

let player;
let debug = false;
const ENTITY_SRC_SIZE = 16;



// enum for entity types
const EntityType = {
	WARRIOR: 0,
	ARCHER: 1,
	WIZARD: 2,
	BOSS: 3,
	MERCHANT: 4
}

class EntityStats {
	constructor(max_health, attack_base, defense_base) {
		this.max_health = max_health;
		this.attack_base = attack_base;
		this.defense_base = defense_base;
	}
}

//4types of enemies and their stats
const entityStats = [
	new EntityStats(100, 10, 10),
	new EntityStats(100, 13, 7),
	new EntityStats(100, 15, 5),
	new EntityStats(100, 80, 500),
	new EntityStats(100, 0, 10)
];

/* entity class 
	 - input: position, type,health
	 - functions: draw, attack, using items, turn system
*/
class Entity {
	constructor(x, y, type, quickslot=[], hostile=true) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.health = entityStats[type].max_health;
		this.max_health = entityStats[type].max_health;
		this.attack_base = entityStats[type].attack_base;
		this.defense_base = entityStats[type].defense_base;
		this.attack_mult = 1;
		this.defense_mult = 1;
		this.quickslot = quickslot;
		this.selected = 0;
		this.hostility = hostile
	}
	

	// draw from sprite
	draw() {
		let x = (this.x-player.x-1+VIEWPORT_WIDTH/2)*TILE_SIZE;
		let y = (this.y-player.y-1+VIEWPORT_HEIGHT/2)*TILE_SIZE;
		image(entitysheet, x, y, TILE_SIZE, TILE_SIZE, this.type*ENTITY_SRC_SIZE, 0, ENTITY_SRC_SIZE, ENTITY_SRC_SIZE);
		if (this.quickslot[this.selected])
			image(itemset, x, y + TILE_SIZE/2, TILE_SIZE/2, TILE_SIZE/2, this.quickslot[this.selected]*ITEM_SRC_SIZE, 0, ITEM_SRC_SIZE, ITEM_SRC_SIZE);
		fill(255, 0, 0);
		rect(x, y-15, 32, 10);
		fill(0, 255, 0);
		rect(x, y-15, (this.health/this.max_health)*32, 10);
	}

	heldItemAttack() {
		return (itemStats[this.quickslot[this.selected]] ? itemStats[this.quickslot[this.selected]].damage : 1);
	}

	heldItemShield() {
		return (itemStats[this.quickslot[this.selected]] ? itemStats[this.quickslot[this.selected]].shield : 1);
	}

	attack(entity) {
		let damage = (this.heldItemAttack() * this.attack_base * this.attack_mult) / (entity.heldItemShield() * entity.defense_base * entity.defense_mult)
		damageMarkers.push({ entity: entity, damage: damage, time: millis() });
		entity.health -= damage;
		if (entity.health <= 0) {
			items[entity.y][entity.x] = entity.quickslot[entity.selected];
			entities.splice(entities.indexOf(entity), 1)
		}
	}

	//Item type and stats
	use(item) {
		switch (item) {
			case Item.POTION_RED:
				this.max_health += 20;
				break;
			case Item.POTION_GREEN:
				this.health = min(this.health + 0.2*this.max_health, this.max_health);
				break;
			case Item.POTION_ORANGE:
				this.attack_mult *= 1.25;
				break;
			case Item.POTION_PINK:
				this.defense_mult *= 1.25;
				break;
			case Item.POTION_YELLOW:
				this.defense_base += 10;
				this.attack_base += 10;
				this.health = this.health/2;
				break;
			default:
				if (item >= Item.SWORD && item <= Item.WOODEN_SHIELD)
					this.quickslot.push(item);
				break;
		}
	}

	//turn based system
	turn() {
		if (this.hostility == false || debug)
			return;
		let xdist = Math.abs(player.x-this.x);
		let ydist = Math.abs(player.y-this.y);
		if (player.x == this.x && player.y == this.y-1)
			this.attack(player);
		else if (player.x == this.x && player.y == this.y+1)
			this.attack(player);
		else if (player.x == this.x-1 && player.y == this.y)
			this.attack(player);
		else if (player.x == this.x+1 && player.y == this.y)
			this.attack(player);
		else if (xdist + ydist < 5) {
			if (xdist > ydist) {
				if (player.x < this.x && isWalkable[tiles[this.y][this.x-1]] && entityAtTile(this.x-1, this.y) == null)
					this.x--;
				else if (player.x > this.x && isWalkable[tiles[this.y][this.x+1]] && entityAtTile(this.x+1, this.y) == null)
					this.x++;
				else if (player.y < this.y && isWalkable[tiles[this.y-1][this.x]] && entityAtTile(this.x, this.y-1) == null)
					this.y--;
				else if (player.y > this.y && isWalkable[tiles[this.y+1][this.x]] && entityAtTile(this.x, this.y+1) == null)
					this.y++;
			}
			else {
				if (player.y < this.y && isWalkable[tiles[this.y-1][this.x]] && entityAtTile(this.x, this.y-1) == null)
					this.y--;
				else if (player.y > this.y && isWalkable[tiles[this.y+1][this.x]] && entityAtTile(this.x, this.y+1) == null)
					this.y++;
				else if (player.x < this.x && isWalkable[tiles[this.y][this.x-1]] && entityAtTile(this.x-1, this.y) == null)
					this.x--;
				else if (player.x > this.x && isWalkable[tiles[this.y][this.x+1]] && entityAtTile(this.x+1, this.y) == null)
					this.x++;
			}
		}
	}	
}

let entities = [new Entity(0, 0, EntityType.WARRIOR, [Item.SWORD])];

player = entities[0]

//check if entity is at position
function entityAtTile(x, y) {
	for (let i = 0; i < entities.length; i++)
		if (x == entities[i].x && y == entities[i].y)
			return entities[i];

	return null;
}

export { entityAtTile, player, entities, Entity, EntityType };
