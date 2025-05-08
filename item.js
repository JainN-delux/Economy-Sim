//-------------- ITEMS --------------

let ITEM_SRC_SIZE = 16;
function drawItems(tile, x, y) {
	image(itemset, x, y, TILE_SIZE, TILE_SIZE, tile*ITEM_SRC_SIZE, 0,ITEM_SRC_SIZE, ITEM_SRC_SIZE)
}
const Item = {
	POTION_RED: 1,
	POTION_PINK: 2,
	POTION_ORANGE: 3,
	POTION_YELLOW: 4,
	POTION_GREEN: 5,
}
let items = Array.from({ length: WORLD_HEIGHT }, () => new Array(WORLD_WIDTH).fill(null));
//ITEM SPAWN 
function itemInRoom() {
    const number = randint(1, 5); 
	for (let i = 0; i < number; i++) {
		for (let i = 1; i < rooms.length; i++) {
			let x = randint(rooms[i].x + 1, rooms[i].x + rooms[i].w-1);
			let y = randint(rooms[i].y + 1 , rooms[i].y + rooms[i].h -1);
			items[y][x] = randint(1, 5);
		}
	}
}

//collision
function pickUp(px,py,items) {
	for (let x = 0; x < VIEWPORT_WIDTH; x++) {
		for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
			let tile_x = Math.floor(x+px-VIEWPORT_WIDTH/2);
			let tile_y = Math.floor(y+py-VIEWPORT_HEIGHT/2);
			if (items[tile_x][tile_y] != null) {
				if (px == tile_x && py == tile_y ) {
					playerItems.push(items[tile_x][tile_y])
					items[tile_x][tile_y] = null
				}
			}
		}
	}
}
