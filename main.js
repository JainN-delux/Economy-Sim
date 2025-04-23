// Time Keeping Variables
var now = 0;  // Current Time in seconds since start of program
var last = 0; // Time since start of program for the last frame
var dt = 0;   // Time between frames

let inventory = {};
let sprites = [];
let bag = {};

let inventoryOpen = false



let tileset;
const WORLD_WIDTH = 256;
const WORLD_HEIGHT = 256;
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
let tiles = Array.from({ length: WORLD_HEIGHT }, () => new Array(WORLD_WIDTH).fill(Tile.FLOOR));

function preload() {
	tileset = loadImage("/assets/tileset.png");
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

	/*sprites = ["@", "#", "$", "%", "&", "*", "?"]

	// width of the bag area
	bag.w = 192;
	// height of the bag area
	bag.h = 200;
	// columns of items based on bag width (without padding)
	bag.cols = Math.floor(bag.w / 32);
	// which item is currently selected
	bag.active_item = 0;

	bag.contents = [
		{ name: "Sting", sprite: pickSprite() },
		{ name: "Elven cape", sprite: pickSprite() },
		{ name: "Sauron's ring", sprite: pickSprite() },
		{ name: "Lembas", sprite: pickSprite() },
		{ name: "Mithril vest", sprite: pickSprite() },
		{ name: "Water", sprite: pickSprite() },
		{ name: "Elven rope", sprite: pickSprite() },
	];*/
}

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
	// Key X / Inventory
	// if x is pressed and the inventory is not open 
	if (keyIsDown(88)) {
		inventoryOpen = inventoryOpen ? false : true;
		
	} 


	// if (keyIsDown(58) && !inventoryOpen) {
	// 	inventoryOpen = true
		

	// // if x is pressed and the inventory is open
	// } else if (keyIsDown(58) && inventoryOpen) {
	// 	inventoryOpen = false
	// } 



	// drawing the world
	drawWorld(player_x, player_y);
	// drawing a window that is the inventory 
	drawInvent()
	// Draw player (add sprite here later)
	rect(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 10, 10)
}
