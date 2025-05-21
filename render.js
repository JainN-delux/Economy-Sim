import { WORLD_WIDTH, WORLD_HEIGHT, tiles } from "./generateWorld.js";
import { entities, player } from "./entity.js";
import { turnCount, attack_x, attack_y } from "./main.js";
import { items,Item,itemInRoom, inventory, itemStats, ITEM_SRC_SIZE } from "./item.js" 

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
	itemset = loadImage("./assets/item1.png");
	entitysheet = loadImage("./assets/entitySheet.png");
	
}		// all images for easy access

let damageMarkers = []; // hold relivent info to make the damage float

function drawInvent() {
	if (inventory.open) {
		let i_x = 150;
		let i_y = 150;
		const stat_x = CANVAS_WIDTH-TILE_SIZE*9;
		fill(100, 100, 100);
		rect(i_x, i_y, TILE_SIZE*9, TILE_SIZE*6.5);
		fill(255);
		textSize(40);
		text("Inventory", i_x + 50 , i_y + 50);
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 6; j++) {
				fill(255);
				rect(i_x + 7.5 +(j*TILE_SIZE*1.5), i_y + 65 +(i*TILE_SIZE*1.5), TILE_SIZE, TILE_SIZE);

				for (let e = 0; e < inventory.equipped.length; e++ ) {
					if (i**6 + j == inventory.equipped[e]) {
						fill(56, 255, 20)
						rect(i_x + 7.5 +(j*TILE_SIZE*1.5), i_y + 65 +(i*TILE_SIZE*1.5), TILE_SIZE, TILE_SIZE);
					}
				}

				if (i*6 + j == inventory.selected) {
					fill(40, 60, 255);
					rect(i_x + 7.5 +(j*TILE_SIZE*1.5), i_y + 65 +(i*TILE_SIZE*1.5), TILE_SIZE, TILE_SIZE);
				} 
				
				

				if (inventory.items[i*6 + j] != null)
					drawItems(inventory.items[i*6 + j], i_x + 7.5 +(j*TILE_SIZE*1.5), i_y + 65 +(i*TILE_SIZE*1.5));

			}
		}
		fill(0);
		rect(stat_x, 0, TILE_SIZE*9, TILE_SIZE*6);
		fill(255);
		textSize(20);
		text("Level: " + player.lvl, stat_x, 20);
		text("Xp: " + player.xp, stat_x, 40);
		text("Health: " + player.health.toFixed(1), stat_x, 60);
		text("Max Health: " + player.max_health, stat_x, 80);
		text("Attack base: " + player.attack_base*player.lvl.toFixed(1), stat_x, 100);
		text("Defense base: " + player.defense_base*player.lvl.toFixed(1), stat_x, 120);
		text("Attack mult: " + player.attack_mult.toFixed(1), stat_x, 140);
		text("Defense mult: " + player.defense_mult.toFixed(1), stat_x, 160);
		if (inventory.items[inventory.selected])
			text("Item Selected: " + itemStats[inventory.items[inventory.selected]].name, stat_x, 180);
	}
}


function drawHealthbar() {
	noStroke()
	fill(255, 0, 0)
	rect(0, 675, (player.health/entities[0].max_health) * 200, 15)
	stroke(0)
	strokeWeight(4)
	noFill()
	rect(0, 675, 200, 15)
	noStroke()
} // draws the display for the player

function drawRestart() {
	if (player.health <= 0) {
		fill(255)
		stroke(0)
		strokeWeight(4)
		rect(CANVAS_WIDTH/3,CANVAS_HEIGHT/2,CANVAS_WIDTH/3,200)
		noStroke()
		fill(0)
		textSize(32)
		text("Restart",CANVAS_WIDTH/3+70,CANVAS_HEIGHT/2+70)
	} else { // draws the restart button in the corner
		fill (255)
		stroke (0)
		strokeWeight(2)
		rect(CANVAS_WIDTH-50, 0, 50, 50)
		noStroke()
	} // draws the "death screen"
} // draws the restart button

function drawQuickslot() {
	fill(0)
	rect(0, CANVAS_HEIGHT-70, 250, 70)
	for (let i = 0; i < 4; i++) {
		fill(255)
		rect(10 + i*60, CANVAS_HEIGHT-55, 50, 50)
		if (player.quickslot[i])
			image(itemset, 10 + i*60, CANVAS_HEIGHT-55, TILE_SIZE, TILE_SIZE, player.quickslot[i]*ITEM_SRC_SIZE, 0,ITEM_SRC_SIZE, ITEM_SRC_SIZE)
	} // draws the squares 4 times
} // draws the quick slots in the bottom

function drawDamageMarker(damageMarker) {
	fill(255, 0, 0)
	textSize(10);
	let x = (damageMarker.entity.x-player.x-1+VIEWPORT_WIDTH/2)*TILE_SIZE;
	let y = (damageMarker.entity.y-player.y-1+VIEWPORT_HEIGHT/2)*TILE_SIZE;
	text(damageMarker.damage.toFixed(2), x, y-(millis()-damageMarker.time)/100, 100)
	fill(0,0,0)
} // displayes the damage numbers above the player/entity


function drawTile(tile, x, y) {
	image(tileset, x, y, TILE_SIZE, TILE_SIZE, tile*TILE_SRC_SIZE, 0, TILE_SRC_SIZE, TILE_SRC_SIZE);
} // Draws a tile at (x, y)

function drawItems(item, x, y) {
	image(itemset, x, y, TILE_SIZE, TILE_SIZE, item*ITEM_SRC_SIZE, 0,ITEM_SRC_SIZE, ITEM_SRC_SIZE)
} // draws the item at the x & y


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
			const item = items[tile_y][tile_x];
			if (item !== null) {
				drawItems(item, (x - fract(px) - 1) * TILE_SIZE, (y - fract(py) - 1) * TILE_SIZE);
			}
		}
	}

	for (let i = 0; i < entities.length; i++)
		entities[i].draw();

	for (let i = 0; i < damageMarkers.length; i++)
		if (millis()-damageMarkers[i].time > 1000)
			damageMarkers.splice(i--, 1);
		else
			drawDamageMarker(damageMarkers[i]);

	drawHealthbar()
	drawQuickslot()
	drawInvent()
	drawRestart()
	textSize(32);
	fill(255);
	stroke(0);
	text(turnCount, 32, 32);
	fill(0, 0, 0, 0);
	stroke(100, 100, 255);
	strokeWeight(8);
	rect((attack_x-fract(px)+VIEWPORT_WIDTH/2-1)*TILE_SIZE, (attack_y-fract(py)+VIEWPORT_HEIGHT/2-1)*TILE_SIZE, TILE_SIZE, TILE_SIZE)
	noStroke()
} // draws the entire map


export { CANVAS_WIDTH, CANVAS_HEIGHT, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, TILE_SIZE, itemset, tileset, entitysheet, drawWorld, damageMarkers };
