// Time Keeping Variables
var now = 0;  // Current Time in seconds since start of program
var last = 0; // Time since start of program for the last frame
var dt = 0;   // Time between frames

let tileset;
const WORLD_WIDTH = 256;
const WORLD_HEIGHT = 256;
const Tile = {
	WATER: 0,
	SAND: 1,
	GRASS: 2,
	DIRT: 3,
	STONE: 4,
	SNOW: 5,
}
let tiles = Array.from({ length: WORLD_HEIGHT }, () => new Array(WORLD_WIDTH).fill(Tile.GRASS));

function preload() {
	tileset = loadImage("/assets/tile_atlas.png");
}

// Size of tile in tile atlas
let TILE_SRC_SIZE = 16;
// Rendered size of tile
let TILE_SIZE = 32;

function drawTile(tile, x, y) {
	image(tileset, x, y, TILE_SIZE, TILE_SIZE, tile*TILE_SRC_SIZE, 0, TILE_SRC_SIZE, TILE_SRC_SIZE)
}

let CANVAS_WIDTH = 768;
let CANVAS_HEIGHT = 768;
function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	noSmooth();

	// Set the noise level and scale.
	let noiseLevel = 6;
	let noiseScale = 0.1;

	for (let y = 0; y < WORLD_HEIGHT; y++) {
		for (let x = 0; x < WORLD_WIDTH; x++) {
			// Scale the input coordinates.
			let nx = noiseScale * x;
			let ny = noiseScale * y;

			// Compute the noise value.
			let c = noiseLevel * noise(nx, ny);

			// Add a more complex formula for tile generation here
			tiles[y][x] = Math.floor(c);
		}
	}
}

let VIEWPORT_WIDTH = 2 + CANVAS_WIDTH / TILE_SIZE;
let VIEWPORT_HEIGHT = 2 + CANVAS_HEIGHT / TILE_SIZE;
function drawWorld(px, py) {
	for (let x = 0; x < VIEWPORT_WIDTH; x++) {
		for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
			let tile_x = Math.floor(x+px-VIEWPORT_WIDTH/2);
			if (tile_x < 0 || tile_x >= WORLD_WIDTH)
				continue
			let tile_y = Math.floor(y+py-VIEWPORT_HEIGHT/2);
			if (tile_y < 0 || tile_y >= WORLD_WIDTH)
				continue
			drawTile(tiles[tile_y][tile_x], (x-fract(px)-1)*TILE_SIZE, (y-fract(py)-1)*TILE_SIZE)
		}
	}
}

let player_x = 0;
let player_y = 0;

function draw() {
	// millis() gives time in milliseconds since start of program
	now = millis()/1000;
	dt = now - last;
	last = now;

	background(220);

	// Key W / UP
	if (keyIsDown(87)) {
		player_y -= 4*dt;
	}
	// Key S / DOWN
	if (keyIsDown(83)) {
		player_y += 4*dt;
	}
	// Key D / RIGHT
	if (keyIsDown(68)) {
		player_x += 4*dt;
	}
	// Key A / LEFT
	if (keyIsDown(65)) {
		player_x -= 4*dt;
	}
	drawWorld(player_x, player_y);
	// Draw player (add sprite here later)
	rect(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 10, 10)
}
