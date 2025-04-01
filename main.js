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
const VIEWPORT_WIDTH = 2 + CANVAS_WIDTH / 64;
const VIEWPORT_HEIGHT = 2 + CANVAS_HEIGHT / 64;
/** This is a setup function. */
function setup() {
	createCanvas(768, 768);
}

/** Something like this for tile drawing */
function drawTile(tile, x, y) {
	image(tileset, x, y, 64, 32, 64*(tile % 9), 64*Math.floor(tile / 9)+32, 64, 32)
}

function drawWorld(px, py) {
	// The math here is wrong as it assumes an cartesian world not an isometric one.
	// The math will need to be changed
	for (let y = 0; y < VIEWPORT_HEIGHT; y++)
		for (let x = 0; x < VIEWPORT_WIDTH; x++) {
			let tiley = y+Math.floor(py/64)-VIEWPORT_HEIGHT/2
			if (tiley < 0 || tiley >= WORLD_HEIGHT)
				continue;
			let tilex = x+Math.floor(px/64)-VIEWPORT_WIDTH/2
			if (tilex < 0 || tilex >= WORLD_WIDTH)
				continue;
			drawTile(tiles[tiley][tilex], (x-1)*32-(y-1)*32, (x-1)*16-(y-1)*16)
		}
}

/** This is a draw function. */
function draw() {
	background(220);
	rect(100, 100, 100, 100)

	drawWorld(0, 0)
}
