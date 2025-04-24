// Time Keeping Variables
var now = 0;  // Current Time in seconds since start of program
var last = 0; // Time since start of program for the last frame
var dt = 0;   // Time between frames

let inventory = {};
let sprites = [];
let bag = {};

let tileset;              // Stores our tileset image
const WORLD_WIDTH = 256;  // The width in tiles in size
const WORLD_HEIGHT = 256; // THe height in tiles in size
// Enums for the different tiles
let inventoryOpen = false
const Tile = {
	WALL_FRONT: 0,
	WALL_SIDE: 1,
	WALL_TOP_LEFT: 2,
	WALL_TOP_RIGHT: 3,
	WALL_BOTTOM_LEFT: 4,
	WALL_BOTTOM_RIGHT: 5,
	WALL: 6,
	FLOOR_TOP_LEFT: 7,
	FLOOR_TOP: 8,
	FLOOR_TOP_RIGHT: 9,
	FLOOR_LEFT: 10,
	FLOOR: 11,
	FLOOR_RIGHT: 12,
	FLOOR_BOTTOM_LEFT: 13,
	FLOOR_BOTTOM: 14,
	FLOOR_BOTTOM_RIGHT: 15,
}
// Our 2D array that stores tile data. This is initially filled with floors
let tiles = Array.from({ length: WORLD_HEIGHT }, () => new Array(WORLD_WIDTH).fill(Tile.FLOOR));

// Preloads our images
function preload() {
	tileset = loadImage("/assets/tileset.png");
}

// Size of tile in tile atlas
let TILE_SRC_SIZE = 16;
// Rendered size of tile
let TILE_SIZE = 32;

// Draws a TILE_SIZE*TILE_SIZE tile at (x, y)
function drawTile(tile, x, y) {
	image(tileset, x, y, TILE_SIZE, TILE_SIZE, tile*TILE_SRC_SIZE, 0, TILE_SRC_SIZE, TILE_SRC_SIZE)
}

let CANVAS_WIDTH = 768;  // Width of p5 canvas
let CANVAS_HEIGHT = 768; // Height of p5 canvas

function pickSprite() {
	let s = Math.floor(random(sprites.length));
	//console.log(s);
	return sprites[s];
}

function drawInvent() {
	if (inventoryOpen) {
		rect(50, 50, 300, 300)
	}
}


let VIEWPORT_WIDTH = 2 + CANVAS_WIDTH / TILE_SIZE; // How many tiles that fit in the screen plus 2 since so they don't white on the edges
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

function drawRoom(rx, ry, w, h) {
	// Draw top and bottom walls and floors
	for (let x = 1; x < w-1; x++) {
		tiles[ry][rx + x] = Tile.WALL_FRONT;
		tiles[ry + h-1][rx + x] = Tile.WALL_FRONT;
		tiles[ry + 1][rx + x] = Tile.FLOOR_TOP;
		tiles[ry + h-2][rx + x] = Tile.FLOOR_BOTTOM;
	}

	// Draw corners
	tiles[ry][rx] = Tile.WALL_TOP_LEFT;
	tiles[ry + 1][rx + 1] = Tile.FLOOR_TOP_LEFT;
	tiles[ry + h-1][rx] = Tile.WALL_BOTTOM_LEFT;
	tiles[ry + h-2][rx + 1] = Tile.FLOOR_BOTTOM_LEFT;

	tiles[ry][rx + w-1] = Tile.WALL_TOP_RIGHT;
	tiles[ry + 1][rx + w-2] = Tile.FLOOR_TOP_RIGHT;
	tiles[ry + h-1][rx + w-1] = Tile.WALL_BOTTOM_RIGHT;
	tiles[ry + h-2][rx + w-2] = Tile.FLOOR_BOTTOM_RIGHT;

	// Draw top and bottom walls and floors
	for (let y = 1; y < h-1; y++) {
		tiles[ry + y][rx] = Tile.WALL_SIDE;
		tiles[ry + y][rx + w-1] = Tile.WALL_SIDE;
		tiles[ry + y][rx + 1] = Tile.FLOOR_LEFT;
		tiles[ry + y][rx + w-2] = Tile.FLOOR_RIGHT;
	}

	// Draw middle floor space
	for (let y = 2; y < h-2; y++) {
		for (let x = 2; x < w-2; x++) {
			tiles[ry + y][rx + x] = Tile.FLOOR;
		}
	}
}

function keyPressed() {
	// Key X / Inventory
	// if x is pressed and the inventory is not open 
	if (key === 'x')
		inventoryOpen = !inventoryOpen;
}

let player_x = 0;
let player_y = 0;

function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	noSmooth(); // Turns off filter on images because we want clear pixel art
	drawRoom(0, 0, 10, 10);
}

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
	if (keyIsDown(88)) {
		
	} 

	// drawing the world
	drawWorld(player_x, player_y);
	// drawing a window that is the inventory 
	drawInvent()
	// Draw player (add sprite here later)
	rect(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 10, 10)
}
