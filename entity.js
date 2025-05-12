import { isWalkable, tiles } from "./generateWorld.js";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, TILE_SIZE, entitysheet } from "./render.js";
import { Item } from "./item.js";
let player;

const ENTITY_SRC_SIZE = 16;
const EntityType = {
	WARRIOR: 0,
	ARCHER: 1,
	WIZARD: 2,
	BOSS: 3,
}

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
	}

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
		entity.health -= 10 * (this.attack_base * this.attack_mult) / (this.defense_base * this.defense_mult);
		if (entity.health <= 0)
			entities.splice(entities.indexOf(entity), 1)
	}

	use(item) {
		switch (item) {
			case Item.POTION_RED:
				this.max_health += 10;
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
				this.defense_base += 5;
				this.attack_base += 5;
				this.health = this.health/2;
				break;
		}
	}

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

let entities = [new Entity(0, 0, EntityType.BOSS, 100, 100)];
player = entities[0]

function entityAtTile(x, y) {
	for (let i = 0; i < entities.length; i++)
		if (x == entities[i].x && y == entities[i].y)
			return entities[i];

	return null;
}

export { entityAtTile, player, entities, Entity, EntityType };
