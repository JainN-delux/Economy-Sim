// Time Keeping Variables
var now = 0;  // Current Time in seconds since start of program
var last = 0; // Time since start of program for the last frame
var dt = 0;   // Time between frames

let inventory = {};
let sprites = ["%", "&", "@", "^", "()", "*", "#"];
let bag = {};

let tileset;              
// Stores our tileset image

let walkset; // array with all walkable tiles

let entitysheet;
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
	EMPTY: 16
}
const isWalkable = [
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
]
// Our 2D array that stores tile data. This is initially filled with floors
let tiles = Array.from({ length: WORLD_HEIGHT }, () => new Array(WORLD_WIDTH).fill(Tile.EMPTY));

// Preloads our images
function preload() {
	tileset = loadImage("/assets/tileset.png");
	itemset = loadImage("/assets/Items/Potion.png");
	entitysheet = loadImage("/assets/Player sheet.png");
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

let rooms = []
let spaces = []

let ENTITY_SRC_SIZE = 16;
let player;


class Entity {
	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	draw() {
		let x = (this.x-player.x-1+VIEWPORT_WIDTH/2)*TILE_SIZE;
		let y = (this.y-player.y-1+VIEWPORT_HEIGHT/2)*TILE_SIZE;
		image(entitysheet, x, y, TILE_SIZE, TILE_SIZE, this.type*ENTITY_SRC_SIZE, 0, ENTITY_SRC_SIZE, ENTITY_SRC_SIZE);
	}
}
let entities = [new Entity(0, 0, 0)];
player = entities[0]


function drawInvent() {
	if (inventoryOpen) {
		rect(20, 20, 300, 300)
		for (let i = 0; i < sprites.length; i++) {
			rect(30 + i*40, 30, 30, 30)
			
		
		
		}
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
			drawTile(tiles[tile_y][tile_x], (x-fract(px)-1)*TILE_SIZE, (y-fract(py)-1)*TILE_SIZE);
			
		}
	}

	for (let i = 0; i < entities.length; i++)
		entities[i].draw();
}

function drawRoom(rx, ry, w, h) {
	rooms.push({ x: rx, y: ry, w: w, h: h});

	// Draw top and bottom walls and floors
	for (let x = 1; x < w-1; x++) {
		tiles[ry][rx + x] = Tile.WALL_FRONT;
		tiles[ry + h-1][rx + x] = Tile.WALL_FRONT;
		tiles[ry + 1][rx + x] = Tile.FLOOR_TOP;
		tiles[ry + h-2][rx + x] = Tile.FLOOR_BOTTOM;
	}

	// Draw left and right walls and floors
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

	// Draw corners
	tiles[ry][rx] = Tile.WALL_TOP_LEFT;
	tiles[ry + 1][rx + 1] = Tile.FLOOR_TOP_LEFT;
	tiles[ry + h-1][rx] = Tile.WALL_BOTTOM_LEFT;
	tiles[ry + h-2][rx + 1] = Tile.FLOOR_BOTTOM_LEFT;

	tiles[ry][rx + w-1] = Tile.WALL_TOP_RIGHT;
	tiles[ry + 1][rx + w-2] = Tile.FLOOR_TOP_RIGHT;
	tiles[ry + h-1][rx + w-1] = Tile.WALL_BOTTOM_RIGHT;
	tiles[ry + h-2][rx + w-2] = Tile.FLOOR_BOTTOM_RIGHT;
}

function randint(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function drawRoomInsideSpace(rx, ry, w, h) {
	spaces.push({ x: rx, y: ry, w: w, h: h});
	let x0 = randint(1, w/2-1);
	let y0 = randint(1, h/2-1);
	let x1 = randint(0, w/2-1);
	let y1 = randint(0, h/2-1);
	drawRoom(rx+x0, ry+y0, w-x0-x1, h-y0-y1);
}

const SplitDir = {
	HORIZONTAL: 0,
	VERTICAL: 1,
};

function connectRooms(roomA, roomB) {
	let room0 = { x: roomA.x + 1, y: roomA.y + 1, w: roomA.w - 2, h: roomA.h - 2 };
	let room1 = { x: roomB.x + 1, y: roomB.y + 1, w: roomB.w - 2, h: roomB.h - 2 };

	let Xtouching = room0.x < room1.x + room1.w && room0.x + room0.w > room1.x;
	let Ytouching = room0.y < room1.y + room1.h && room0.y + room0.h > room1.y;

	let x0 = Math.floor(room0.x + room0.w / 2);
	let y0 = Math.floor(room0.y + room0.h / 2);
	let x1 = Math.floor(room1.x + room1.w / 2);
	let y1 = Math.floor(room1.y + room1.h / 2);

	if (Xtouching) {
		if (roomA.x < roomB.x)
			x0 = randint(roomB.x, roomA.x + roomA.w - 1);
		else
			x0 = randint(roomA.x, roomB.x + roomB.w - 1);
		x1 = x0;
		if (roomA.y < roomB.y) {
			y0 = roomA.y + roomA.h - 1;
			y1 = roomB.y;
		}
		else {
			y0 = roomB.y + roomB.h - 1;
			y1 = roomA.y;
		}
	}
	else if (Ytouching) {
		if (roomA.y < roomB.y)
			y0 = randint(roomB.y, roomA.y + roomA.h - 1);
		else
			y0 = randint(roomA.y, roomB.y + roomB.h - 1);
		y1 = y0;
		if (roomA.x < roomB.x) {
			x0 = roomA.x + roomA.w - 1;
			x1 = roomB.x;
		}
		else {
			x0 = roomB.x + roomB.w - 1;
			x1 = roomA.x;
		}
	}

	// Draw horizontal first, then vertical
	if (x0 != x1) {
		let [startX, endX] = x0 < x1 ? [x0, x1] : [x1, x0];
		for (let x = startX; x <= endX; x++) {
			tiles[y0-1][x] = Tile.WALL_FRONT;
			tiles[y0][x] = Tile.FLOOR;
			tiles[y0+1][x] = Tile.WALL_FRONT;
		}
	}
	if (y0 != y1) {
		let [startY, endY] = y0 < y1 ? [y0, y1] : [y1, y0];
		for (let y = startY; y <= endY; y++) {
			tiles[y][x1-1] = Tile.WALL_SIDE;
			tiles[y][x1] = Tile.FLOOR;
			tiles[y][x1+1] = Tile.WALL_SIDE;
		}
	}
}


function generateRooms(rx, ry, w, h) {
	if (w <= 16 && h <= 16) {
		drawRoomInsideSpace(rx, ry, w, h);
		return;
	}
	let splitDir = randint(0, 2);
	if ((splitDir == SplitDir.HORIZONTAL || h <= 16) && w > 16) {
		let pos = randint(4, w-8);
		generateRooms(rx, ry, pos, h);
		generateRooms(rx+pos, ry, w-pos, h);
		return;
	}
	if ((splitDir == SplitDir.VERTICAL || w <= 16) && h > 16) {
		let pos = randint(4, h-8);
		generateRooms(rx, ry, w, pos);
		generateRooms(rx, ry+pos, w, h-pos);
		return;
	}
	drawRoomInsideSpace(rx, ry, w, h);
}


 
function keyPressed() {
	// Key X / Inventory
	// if x is pressed and the inventory is not open 
	if (key === 'x')
		inventoryOpen = !inventoryOpen;

	if (key == 'w' && isWalkable[tiles[player.y-1][player.x]])
		player.y -= 1
	if (key == 's' && isWalkable[tiles[player.y+1][player.x]])
		player.y += 1
	if (key == 'a' && isWalkable[tiles[player.y][player.x-1]])
		player.x -= 1
	if (key == 'd' && isWalkable[tiles[player.y][player.x+1]])
		player.x += 1
}

function AABB_collide(rect1, rect2) {
	return (rect1.x < rect2.x + rect2.w &&
		rect1.x + rect1.w > rect2.x &&
		rect1.y < rect2.y + rect2.h &&
		rect1.y + rect1.h > rect2.y);
}

function spaceAdjacent(space1, space2) {
	return AABB_collide({x: space1.x - 1, y: space1.y - 1, w: space1.w + 2, h: space1.h + 2}, {x: space2.x - 1, y: space2.y - 1, w: space2.w + 2, h: space2.h + 2});
}

let temp;
function generateEnemies() {
	for (let i = 1; i < rooms.length; i++) {
		temp = new Entity(randint(rooms[i].x + 1, rooms[i].x + rooms[i].w - 1), randint(rooms[i].y , rooms[i].y + rooms[i].w ), 1)
		entities.push(temp)
	}
}




function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	noSmooth(); // Turns off filter on images because we want clear pixel art
	generateRooms(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
	generateEnemies()
	player.x = rooms[0].x + 1;
	player.y = rooms[0].y + 1;
	for (let i = 0; i < spaces.length; i++)
		for (let j = i + 1; j < spaces.length; j++)
			if (spaceAdjacent(spaces[i], spaces[j]))
				connectRooms(rooms[i], rooms[j]);
}


function draw() {
	// millis() gives time in milliseconds since start of program
	now = millis()/1000;
	dt = now - last;
	last = now;

	background(220);
	drawWorld(player.x, player.y);
	// drawing a window that is the inventory 
	drawInvent()
}
