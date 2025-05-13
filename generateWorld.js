import { Entity, EntityType, entities, player } from "./entity.js";
import { itemInRoom, Item } from "./item.js";




//CONSTANTS
const WORLD_WIDTH = 256;   // The width in tiles in size
const WORLD_HEIGHT = 256;  // The height in tiles in size

//arrays
let rooms = []
let spaces = []

//fundamental functions
function randint(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Enums for the different tiles
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
// check if entities can walk on tiles or not
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
];

// Our 2D array that stores tile data. This is initially filled with floors
let tiles = Array.from({ length: WORLD_HEIGHT }, () => new Array(WORLD_WIDTH).fill(Tile.EMPTY));


/* function
	- draw a rooms based on position and dimension inputs
	- adds tiles design based on location
*/
function generateRoom(rx, ry, w, h) {
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

/* function
	- get random non-overlapping poistion and dimersion
	- to be used in generateRoom function
*/
function generateRoomInsideSpace(rx, ry, w, h) {
	spaces.push({ x: rx, y: ry, w: w, h: h});
	let x0 = randint(1, w/2-2);
	let y0 = randint(1, h/2-2);
	let x1 = randint(0, w/2-2);
	let y1 = randint(0, h/2-2);
	generateRoom(rx+x0, ry+y0, w-x0-x1, h-y0-y1);
}

const SplitDir = {
	HORIZONTAL: 0,
	VERTICAL: 1,
	MAX: 2,
};


function connectRooms(roomA, roomB) {
	// Room floor tiles
	let room0 = { x: roomA.x + 1, y: roomA.y + 1, w: roomA.w - 2, h: roomA.h - 2 };
	let room1 = { x: roomB.x + 1, y: roomB.y + 1, w: roomB.w - 2, h: roomB.h - 2 };

	// Check if they align together and there can be a straight path connecting them
	let Xtouching = room0.x < room1.x + room1.w && room0.x + room0.w > room1.x;
	let Ytouching = room0.y < room1.y + room1.h && room0.y + room0.h > room1.y;

	// The two points to connect
	let x0;
	let y0;
	let x1;
	let y1;

	// Find the two points on the walls
	if (Xtouching) {
		// Pick random possible x position
		if (roomA.x < roomB.x)
			x0 = randint(roomB.x + 1, Math.min(roomA.x + roomA.w - 2, roomB.x + roomB.w - 2));
		else
			x0 = randint(roomA.x + 1, Math.min(roomA.x + roomA.w - 2, roomB.x + roomB.w - 2));
		x1 = x0;
		// Get the bottom of one room and the top of the other
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
		// Pick random possible y position
		if (roomA.y < roomB.y)
			y0 = randint(roomB.y + 1, Math.min(roomA.y + roomA.h - 2, roomB.y + roomB.h - 2));
		else
			y0 = randint(roomA.y + 1, Math.min(roomA.y + roomA.h - 2, roomB.y + roomB.h - 2));
		y1 = y0;
		// Get the right side of one room and the left of the other
		if (roomA.x < roomB.x) {
			x0 = roomA.x + roomA.w - 1;
			x1 = roomB.x;
		}
		else {
			x0 = roomB.x + roomB.w - 1;
			x1 = roomA.x;
		}
	}
	else
		return

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
	// Mark doors
	//tiles[y0][x0] = Tile.FLOOR;
	//tiles[y1][x1] = Tile.FLOOR;
}

// -------------ROOMS GENERATION--------------
function generateRooms(rx, ry, w, h) {
	if (w <= 32 && h <= 32) {
		generateRoomInsideSpace(rx, ry, w, h);
		return;
	}
	let splitDir = randint(0, SplitDir.MAX);
	if ((splitDir == SplitDir.HORIZONTAL || h <= 32) && w > 32) {
		let pos = randint(4, w-8);
		generateRooms(rx, ry, pos, h);
		generateRooms(rx+pos, ry, w-pos, h);
		return;
	}
	if ((splitDir == SplitDir.VERTICAL || w <= 32) && h > 32) {
		let pos = randint(4, h-8);
		generateRooms(rx, ry, w, pos);
		generateRooms(rx, ry+pos, w, h-pos);
		return;
	}
	generateRoomInsideSpace(rx, ry, w, h);
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

function generateEnemies() {
	for (let i = 1; i < rooms.length; i++) {
		if (rooms[i] == bossRoom) {
			entities.push(new Entity(randint(rooms[i].x + 1, rooms[i].x + rooms[i].w - 1), randint(rooms[i].y + 1, rooms[i].y + rooms[i].h ), EntityType.BOSS, [randint(Item.SWORD, Item.WOODEN_SHIELD+1)]))
		}
		if (rooms[i] == merchantRooms[0]) {
			
			entities.push(new Entity(randint(rooms[i].x + 1, rooms[i].x + rooms[i].w - 1), randint(rooms[i].y + 1, rooms[i].y + rooms[i].h ), EntityType.MERCHANT, Item.SWORD, false))
		}
		let enemies = randint(1, 1 + Math.floor(rooms[i].w*rooms[i].h / 102));
		for (let j = 0; j < enemies; j++)
			entities.push(new Entity(randint(rooms[i].x + 1, rooms[i].x + rooms[i].w - 1), randint(rooms[i].y + 1, rooms[i].y + rooms[i].h - 1 ), randint(EntityType.WARRIOR+1, EntityType.WIZARD+1), [randint(Item.SWORD, Item.WOODEN_SHIELD+1)]))
	}
}

let bossRoom;

function generateBossroom() {
	let best = 0;
	for (let i = 1; i < rooms.length; i++) {
		if ((rooms[i].h * rooms[i].w) > (best)) {
			bossRoom = rooms[i];
			best = rooms[i].h * rooms[i].w;
		}
	}
}

let merchantRooms = []

// broken merchant gen
function generateMerchant() {
	let smallestRoom = {w: Infinity, h: Infinity };
	for (let i = 1; i < rooms.length; i++) {
		if ((rooms[i].h * rooms[i].w) < (smallestRoom.w*smallestRoom.h)) {
			smallestRoom = rooms[i];
		}
	}
	merchantRooms.push(smallestRoom);
	console.log(merchantRooms[0])
	
}




function generateWorld() {
	generateRooms(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
	generateBossroom()
	generateEnemies()
	itemInRoom()
	generateMerchant()
	player.x = rooms[0].x + 1;
	player.y = rooms[0].y + 1;
	for (let i = 0; i < spaces.length; i++)
		for (let j = i + 1; j < spaces.length; j++)
			if (spaceAdjacent(spaces[i], spaces[j]))
				connectRooms(rooms[i], rooms[j]);
}



export { WORLD_WIDTH, WORLD_HEIGHT, isWalkable, generateWorld, tiles ,randint,rooms};
