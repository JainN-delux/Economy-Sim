import { WORLD_WIDTH, WORLD_HEIGHT, tiles } from "./generateWorld.js";
import { entities } from "./entity.js";
const CANVAS_WIDTH = 768;  // Width of p5 canvas
const CANVAS_HEIGHT = 768; // Height of p5 canvas
const TILE_SRC_SIZE = 16;  // Size of tile in tile atlas
const TILE_SIZE = 32;      // Rendered size of tile

let tileset;               // Stores our tileset image
let entitysheet;           // Stores our entity tilesheet image
let itemset;
// Preloads our images
window.preload = () => {
	tileset = loadImage("./assets/tileset.png");
	itemset = loadImage("./assets/Items/Potion.png");
	entitysheet = loadImage("./assets/Entity sheet.png");
	
}

let inventory = {};
let inventoryOpen = false;
function drawInvent() {
	if (inventoryOpen) {
		let i_x = 250;
		let i_y = 250;
		fill("red");
		rect(i_x, i_y, TILE_SIZE*9, TILE_SIZE*6.5);
		fill(255);
		textSize(40);
		for (let i = 0; i < 6; i++) {
			text("Inventory", i_x + 50 , i_y + 50);
			for (let j = 0; j < 3; j++) {
				rect(i_x + 7.5 +(i*TILE_SIZE*1.5), i_y + 65 +(j*TILE_SIZE*1.5), TILE_SIZE, TILE_SIZE);
			}	
		}
	}
}

function drawQuickslot() {
	fill(0)
	rect(0, CANVAS_HEIGHT-70, 250, 70)
	for (let i = 0; i < 4; i++) {
		fill(255)
		rect(10 + i*60, CANVAS_HEIGHT-55, 50, 50)
	}

}

function drawHealthbar() {
	noStroke()
	fill(255, 0, 0)
	rect(0, 675, (entities[0].health/entities[0].max_health) * 200, 15)
	stroke(0)
	strokeWeight(4)
	noFill()
	rect(0, 675, 200, 15)
	noStroke()
}

function drawTile(tile, x, y) {				// Draws a TILE_SIZE*TILE_SIZE tile at (x, y)
	image(tileset, x, y, TILE_SIZE, TILE_SIZE, tile*TILE_SRC_SIZE, 0, TILE_SRC_SIZE, TILE_SRC_SIZE);
}

const VIEWPORT_WIDTH = 2 + CANVAS_WIDTH / TILE_SIZE; // How many tiles that fit in the screen plus 2 since so they don't white on the edges
const VIEWPORT_HEIGHT = 2 + CANVAS_HEIGHT / TILE_SIZE;
function drawWorld(px, py) {
	for (let x = 0; x < VIEWPORT_WIDTH; x++) {
		for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
			let tile_x = Math.floor(x+px-VIEWPORT_WIDTH/2);
			if (tile_x < 0 || tile_x >= WORLD_WIDTH)
				continue
			let tile_y = Math.floor(y+py-VIEWPORT_HEIGHT/2);
			if (tile_y < 0 || tile_y >= WORLD_HEIGHT)
				continue
			drawTile(tiles[tile_y][tile_x], (x-fract(px)-1)*TILE_SIZE, (y-fract(py)-1)*TILE_SIZE);
			
		}
	}

	for (let i = 0; i < entities.length; i++)
		entities[i].draw();

	drawHealthbar()
	drawQuickslot()
	drawInvent()
}

export { CANVAS_WIDTH, CANVAS_HEIGHT, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, TILE_SIZE, tileset, entitysheet, inventoryOpen, drawWorld };
