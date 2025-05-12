import { isWalkable, tiles } from "./generateWorld.js";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, TILE_SIZE, entitysheet } from "./render.js";
import { Item } from "./item.js";

//defining variables
let player;
const ENTITY_SRC_SIZE = 16;

// enum for entity types
const EntityType = {
	WARRIOR: 0,
	ARCHER: 1,
	WIZARD: 2,
	BOSS: 3,
}

/* entity class 
	 - input: position, type,health
	 - functions: draw, attack, using items, turn system
*/
class Entity {
	constructor(x, y, type, health, max_health) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.health = health;
		this.max_health = max_health
		this.attack_base = 10;
		this.defense_base = 10;
		this.attack_mult = 1;
		this.defense_mult = 1;
		this.last_dmg = 0
	}
	// draw from sprite
	draw() {
		let x = (this.x-player.x-1+VIEWPORT_WIDTH/2)*TILE_SIZE;
		let y = (this.y-player.y-1+VIEWPORT_HEIGHT/2)*TILE_SIZE;
		image(entitysheet, x, y, TILE_SIZE, TILE_SIZE, this.type*ENTITY_SRC_SIZE, 0, ENTITY_SRC_SIZE, ENTITY_SRC_SIZE);
		fill(255, 0, 0);
		rect(x, y-15, 32, 10);
		fill(0, 255, 0);
		rect(x, y-15, (this.health/this.max_health)*32, 10);
	}

	attack(entity) {
		let damage = 10 * (this.attack_base * this.attack_mult) / (entity.defense_base * entity.defense_mult)
		entity.health -= damage;
		this.last_dmg = damage
		if (entity.health <= 0) 
			entities.splice(entities.indexOf(entity), 1)

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
		}
	}

	//turn based system
	turn() {
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
		else if (xdist + ydist < 10) {
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

//array to store entities
let entities = [new Entity(0, 0, EntityType.BOSS, 100, 100)];
player = entities[0]

//check is entity is at position
function entityAtTile(x, y) {
	for (let i = 0; i < entities.length; i++)
		if (x == entities[i].x && y == entities[i].y)
			return entities[i];

	return null;
}

export { entityAtTile, player, entities, Entity, EntityType };
