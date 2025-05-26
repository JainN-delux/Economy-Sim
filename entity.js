import { isWalkable, tiles } from "./generateWorld.js";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, TILE_SIZE, entitysheet, itemset, damageMarkers } from "./render.js";
import { items, Item, itemStats, ITEM_SRC_SIZE, inventory } from "./item.js";
import { turnCount } from "./main.js";

let player;
const ENTITY_SRC_SIZE = 16;

// This turns off things like hostile enemies
let debug = false;

// enum for entity types
const EntityType = {
	WARRIOR: 0,
	ARCHER: 1,
	WIZARD: 2,
	BOSS: 3,
	MERCHANT: 4
}

function countTime(limit) {
    let previous = timeCount; 
    if (previous + limit <= turnCount) { 
        return true;
    } else {
        return false;
    }
}


const statusList = {
	VINES: 1, // 5 dot 5t
	FIRE: 2, // locks movement 5t
	POISON: 3, // 1 dot 60t
	BLEED: 4, // 1% health dot 1t
	NULL: 5, // turns of magic 10t
	STUN: 6, // skips turn 1t
	// these buffs effect an inate value which will decay to a targetted value slowly
	ATTACKBUFF: 7, // increases attack power 
	DEFENCEBUFF: 8, // increases defence power
	TIMEBUFF: 9, // gives a extra turn 
	INVISIBLE: 10 // makes u invisible
}



// Objects of this class will store base stats of the different entity types and the objects will be put into the entityStats array
class EntityStats {
	constructor(max_health, attack_base, defense_base) {
		this.max_health = max_health;
		this.attack_base = attack_base;
		this.defense_base = defense_base;
	}
}

// assign 4 types of enemies and their stats
const entityStats = [
	new EntityStats(100, 10, 10),
	new EntityStats(100, 13, 7),
	new EntityStats(100, 15, 5),
	new EntityStats(100, 80, 500),
	new EntityStats(100, 0, 10)
];

/*
 * An entity includes the player, enemies, merchants and bosses, basically anything that moves
 */
class Entity {
	constructor(x, y, type, lvl, quickslot=[], hostile=true) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.health = entityStats[type].max_health;
		this.max_health = entityStats[type].max_health;
		this.attack_base = entityStats[type].attack_base;
		this.defense_base = entityStats[type].defense_base;
		this.attack_mult = 1;
		this.defense_mult = 1;
		this.lvl = lvl;
		this.xp = 0;
		this.quickslot = quickslot;
		this.selected = 0;
		this.hostility = hostile
	}

	// Draws entity sprite, healthbar and weapon
	draw() {
		// Translate tile coordinates to screenspace
		let x = (this.x-player.x-1+VIEWPORT_WIDTH/2)*TILE_SIZE;
		let y = (this.y-player.y-1+VIEWPORT_HEIGHT/2)*TILE_SIZE;
		image(entitysheet, x, y, TILE_SIZE, TILE_SIZE, this.type*ENTITY_SRC_SIZE, 0, ENTITY_SRC_SIZE, ENTITY_SRC_SIZE);
		// Draw held item
		if (this.quickslot[this.selected])
			image(itemset, x, y + TILE_SIZE/2, TILE_SIZE/2, TILE_SIZE/2, this.quickslot[this.selected]*ITEM_SRC_SIZE, 0, ITEM_SRC_SIZE, ITEM_SRC_SIZE);
		// Draw healtbar
		fill(255, 0, 0);
		rect(x, y-15, 32, 10);
		fill(0, 255, 0);
		rect(x, y-15, (this.health/this.max_health)*32, 10);
	}

	// Gets the attack stat of the current held item of the entity
	heldItemAttack() {
		return (itemStats[this.quickslot[this.selected]] ? itemStats[this.quickslot[this.selected]].damage : 1);
	}

	// Gets the shield stat of the current held itme of the entity
	heldItemShield() {
		return (itemStats[this.quickslot[this.selected]] ? itemStats[this.quickslot[this.selected]].shield : 1);
	}

	gainXp(xp) {
		this.xp += xp;
		if (this.xp >= this.lvl*10) {
			this.xp -= this.lvl*10;
			this.lvl++;
		}
	}

	// attack and damage
	attack(entity) {
		// Calculate damage of attack by doing attack value / defense value
		let damage = (this.heldItemAttack() * this.attack_base * this.attack_mult * (this.lvl)) / (entity.heldItemShield() * entity.defense_base * entity.defense_mult * (entity.lvl))
		// show damage on screen
		damageMarkers.push({ entity: entity, damage: damage, time: millis() });
		entity.health -= damage;
		// Delete entity and drop held item if health < 0
		if (entity.health <= 0) {
			this.gainXp(entity.lvl);
			items[entity.y][entity.x] = entity.quickslot[entity.selected];
			entities.splice(entities.indexOf(entity), 1)
		}
	}

	returnBase() {
		if (this.attack_mult >= 1)
			this.attack_mult = (this.attack_mult-1)*0.9 + 1;
		if (this.defense_mult >= 1)
			this.defense_mult = (this.defense_mult-1)*0.9 + 1;
	}

	//Use item from inventory when selected
	use(item) {
		switch (item) {
			case Item.POTION_RED:
				this.max_health += 20;
				break;
			case Item.POTION_GREEN:
				this.health = min(this.health + 0.30*this.max_health, this.max_health);
				break;
			case Item.POTION_ATTACK:
				this.attack_mult *= 2;
				break;
			case Item.POTION_DEFENCE:
				this.defense_mult *= 2;
				break;
			case Item.POTION_PURPLE:
				this.gainXp(5);
				this.health = this.health/2;
				break;
			//if item is WEAPON push to quickslot
			default:
				if (item >= Item.SWORD && item <= Item.WOODEN_SHIELD) {
					if (this.quickslot.length >= 4)
						inventory.add(this.quickslot.splice(3, 1)[0]);
					this.quickslot.push(item);
				}
				break;
		}
	}

	activeEffects(type) {
		switch(type) {
			case statusList.VINES:
				this.health -= 5;
				break;
			case statusList.FIRE:
				this.health -= 5;
				break;

			
				
			case statusList.POISON:
				this.health -= this.max_health/100;
				break;

			case statusList.BLEED:
				this.health -= this.max_health/100;
				break;

			case statusList.NULL:
				this.attack_mult = 0;
				this.defense_mult = 1;
				break;

			case statusList.STUN:
				this.hostility = false;
				break;

			case statusList.ATTACKBUFF:
				this.attack_mult *= 2;
				break;

			case statusList.DEFENCEBUFF:
				this.defense_mult *= 2;
				break;

			case statusList.TIMEBUFF:
				turnCount += 1
				break;

			case statusList.INVISIBLE:
				this.hostility = false	
				break;	
		}
			
	}

	//turn based system
	turn() {
		this.returnBase()
		// Don't attack or move torwards player if not hostile
		if (this.hostility == false || debug)
			return;
		// Get the distance between enemy and players
		let xdist = Math.abs(player.x-this.x);
		let ydist = Math.abs(player.y-this.y);
		// Attack if the player is within reach (adjacent)
		if (player.x == this.x && player.y == this.y-1)
			this.attack(player);
		else if (player.x == this.x && player.y == this.y+1)
			this.attack(player);
		else if (player.x == this.x-1 && player.y == this.y)
			this.attack(player);
		else if (player.x == this.x+1 && player.y == this.y)
			this.attack(player);
		// If enemy is detected within aggro range moves toward player
		else if (xdist + ydist < 10) {
			// Choose axis to move in based on proximity
			if (xdist > ydist) {
				// If the player is the given direction and the tile is empty
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
				// If the player is the given direction and the tile is empty
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

// Spawn player
let entities = [new Entity(0, 0, EntityType.WARRIOR, 1, [Item.BOW])];
player = entities[0]

// Returns entity at a position
function entityAtTile(x, y) {
	for (let i = 0; i < entities.length; i++)
		if (x == entities[i].x && y == entities[i].y)
			return entities[i];

	return null;
}

export { entityAtTile, player, entities, Entity, EntityType };
