let tileset;
const WORLD_WIDTH = 200;
const WORLD_HEIGHT = 200;
const Tile = {
	GRASS: 0,
}
let tiles = Array.from({ length: WORLD_HEIGHT }, () => new Array(WORLD_WIDTH).fill(Tile.GRASS));

function preload() {
	tileset = loadImage("/assets/tileset.png");
}

const CANVAS_WIDTH = 768;
const CANVAS_HEIGHT = 768;
// Recalculate this
const VIEWPORT_WIDTH = 64;
const VIEWPORT_HEIGHT = 64;
/** This is a setup function. */
function setup() {
	createCanvas(768, 768);
}

/** Something like this for tile drawing */
function drawTile(tile, x, y) {
	image(tileset, x, y, 64, 64, 64*(tile % 9), 64*Math.floor(tile / 9), 64, 64)
}

function drawWorld(px, py) {
	let x_fract = fract(px)
	let y_fract = fract(py)
	for (let y = 0; y < VIEWPORT_HEIGHT; y++)
		for (let x = 0; x < VIEWPORT_WIDTH; x++) {
			let tiley = y+Math.floor(py)-VIEWPORT_HEIGHT/2
			if (tiley < 0 || tiley >= WORLD_HEIGHT)
				continue;
			let tilex = x+Math.floor(px)-VIEWPORT_WIDTH/2
			if (tilex < 0 || tilex >= WORLD_WIDTH)
				continue;
			drawTile(tiles[tiley][tilex], (x+x_fract-y-y_fract)*32, (x+x_fract+y+y_fract)*16)
		}
}

let player_x = 0;
let player_y = 0;

/** This is a draw function. */
function draw() {
	background(220);

	if (keyIsDown(87)) {
		player_x -= 0.1
		player_y -= 0.1
	}
	if (keyIsDown(83)) {
		player_x += 0.1
		player_y += 0.1
	}
	if (keyIsDown(68)) {
		player_x += 0.1
		player_y -= 0.1
	}
	if (keyIsDown(65)) {
		player_x -= 0.1
		player_y += 0.1
	}
	drawWorld(player_x, player_y)
	let screen_x = (player_x - player_y)
	let screen_y = (player_x + player_y)
	rect(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 10, 10)
}
