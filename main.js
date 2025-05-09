import { isWalkable, generateWorld, tiles } from "./generateWorld.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, tileset, entitysheet, drawWorld } from "./render.js";
import { entityAtTile, player, entities } from "./entity.js";
import { inventory, items } from "./item.js";

let turnCount = 0;

function updateWorld() {
	if (items[player.y][player.x] != null) {
		inventory.add(items[player.y][player.x]);
		items[player.y][player.x] = null;
	}
	for (let i = 1; i < entities.length; i++)
		entities[i].turn();
}

window.keyPressed = () => {
	// Key X / Inventory
	// if x is pressed and the inventory is not open 
	if (key === 'x')
		inventory.toggle();

	if (key == 'w' && isWalkable[tiles[player.y-1][player.x]]) {
		let e = entityAtTile(player.x, player.y-1);
		if (e == null)
			player.y -= 1
		else
			player.attack(e);
		updateWorld();
		turnCount++;
	}
	if (key == 's' && isWalkable[tiles[player.y+1][player.x]]) {
		let e = entityAtTile(player.x, player.y+1);
		if (e == null)
			player.y += 1
		else
			player.attack(e);
		updateWorld();
		turnCount++;
	}
	if (key == 'a' && isWalkable[tiles[player.y][player.x-1]]) {
		let e = entityAtTile(player.x-1, player.y);
		if (e == null)
			player.x -= 1
		else
			player.attack(e);
		updateWorld();
		turnCount++;
	}
	if (key == 'd' && isWalkable[tiles[player.y][player.x+1]]) {
		let e = entityAtTile(player.x+1, player.y);
		if (e == null)
			player.x += 1
		else
			player.attack(e);
		updateWorld();
		turnCount++;
	}
}

window.setup = () => {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	noSmooth(); // Turns off filter on images because we want clear pixel art
	generateWorld();
}

window.draw = () => {
	background(220);
	drawWorld(player.x, player.y);
}

export { turnCount };
