let entitysheet;
let ENTITY_SRC_SIZE = 32;
let player;

class Entity {
	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	draw() {
		let x = (this.x-fract(player.x)-1)*TILE_SIZE;
		let y = (this.y-fract(player.y-1))*TILE_SIZE;
		image(entitysheet, x, y, TILE_SIZE, TILE_SIZE, tile*ENTITY_SRC_SIZE, 0, ENTITY_SRC_SIZE, ENTITY_SRC_SIZE);
	}
}
