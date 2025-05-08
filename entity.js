import { isWalkable, tiles } from "./generateWorld.js";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, TILE_SIZE, entitysheet } from "./render.js";
let player;

const ENTITY_SRC_SIZE = 16;

class Entity {
	constructor(x, y, type, health, max_health) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.health = health;
		this.max_health = max_health
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
		entity.health -= 10;
		if (entity.health <= 0)
			entities.splice(entities.indexOf(entity), 1)
	}

	turn() {
		if (player.x == this.x && player.y == this.y-1)
			this.attack(player);
		else if (player.x == this.x && player.y == this.y+1)
			this.attack(player);
		else if (player.x == this.x-1 && player.y == this.y)
			this.attack(player);
		else if (player.x == this.x+1 && player.y == this.y+1)
			this.attack(player);
		else if (Math.abs(player.x-this.x) + Math.abs(player.y-this.y) < 8) {
			if (player.x < this.x && isWalkable[tiles[this.y][this.x-1]])
				this.x--;
			else if (player.x > this.x && isWalkable[tiles[this.y][this.x+1]])
				this.x++;
			else if (player.y < this.y && isWalkable[tiles[this.y-1][this.x]])
				this.y--;
			else if (player.y > this.y && isWalkable[tiles[this.y+1][this.x]])
				this.y++;
		}

	}
}

let entities = [new Entity(0, 0, 0, 100, 100)];
player = entities[0]

function entityAtTile(x, y) {
	for (let i = 0; i < entities.length; i++)
		if (x == entities[i].x && y == entities[i].y)
			return entities[i];

	return null;
}

export { entityAtTile, player, entities, Entity };
