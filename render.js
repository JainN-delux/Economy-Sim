import { WORLD_WIDTH, WORLD_HEIGHT, tiles , merchant, level } from "./generateWorld.js";
import { entities, player, entityStats } from "./entity.js";
import { turnCount, attack_x, attack_y } from "./main.js";
import { items,Item,itemInRoom, inventory, itemStats, ITEM_SRC_SIZE, inRange, inRangeSpecial, shop } from "./item.js" 


//CONSTANTS
const CANVAS_WIDTH = 768;  // Width of p5 canvas
const CANVAS_HEIGHT = 768; // Height of p5 canvas
const TILE_SRC_SIZE = 16;  // Size of tile in tile atlas
const TILE_SIZE = 32;      // Rendered size of tile

//sprite sheet variables
let tileset;                // Stores our tileset image
let entitysheet;            // Stores our entity tilesheet image
let itemset;				// Stores our item tilesheet image
			
// Preloads our images
window.preload = () => { 
	tileset = loadImage("./assets/tileset.png");
	itemset = loadImage("./assets/itemset.png");
	entitysheet = loadImage("./assets/entitySheet.png");
	
}		
let damageMarkers = []; // hold relivent info to make the damage float

//function that draws the inventory
function drawInvent() {
	if (inventory.open) {		//check if the inventory is open
		//inventory asthetics
		let i_x = 150;
		let i_y = 150;
		const stat_x = CANVAS_WIDTH-TILE_SIZE*9;
		fill(100, 100, 100);
		rect(i_x, i_y, TILE_SIZE*9, TILE_SIZE*6.5);
		fill(255);
		textSize(40);
		text("Inventory", i_x + 50 , i_y + 50);
		// draw slots in intevntory (3 * 6 slots)
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
				// highlight the selected item (turn slot blue)
				if (i*6 + j == inventory.selected) {
					fill(40, 60, 255);
					rect(i_x + 7.5 +(j*TILE_SIZE*1.5), i_y + 65 +(i*TILE_SIZE*1.5), TILE_SIZE, TILE_SIZE);
				} 

				//if there is an item in the array draw it on the slot

				if (inventory.items[i*6 + j] != null)
					drawItems(inventory.items[i*6 + j], i_x + 7.5 +(j*TILE_SIZE*1.5), i_y + 65 +(i*TILE_SIZE*1.5));

			}
		}
		//show item stats of selected item on the right side of the screen
		fill(0);
		rect(stat_x, 0, TILE_SIZE*9, TILE_SIZE*9);
		fill(255);
		textSize(20);
		text("Level: " + player.lvl, stat_x, 20);
		text("Xp: " + player.xp, stat_x, 40);
		text("Health: " + player.health.toFixed(2), stat_x, 60);
		text("Max Health: " + player.max_health, stat_x, 80);
		text("Attack base: " + player.attack_base*player.lvl.toFixed(2), stat_x, 100);
		text("Defense base: " + player.defense_base*player.lvl.toFixed(2), stat_x, 120);
		text("Ranged base: " + player.ranged_base*player.lvl.toFixed(2), stat_x, 140);
		text("Attack mult: " + player.attack_mult.toFixed(2), stat_x, 160);
		text("Ranged mult: " + player.ranged_mult.toFixed(2), stat_x, 180);
		text("Defense mult: " + player.defense_mult.toFixed(2), stat_x, 200);
		if (inventory.items[inventory.selected])
			text("Item Selected: " + itemStats[inventory.items[inventory.selected]].name, stat_x, 220);
		text("X Location: " + player.x, stat_x, 240)
		text("Y Location: " + player.y, stat_x, 260)
	}
}

// draws HEALTH BAR of the player
function drawHealthbar() {
	noStroke()
	fill(255, 0, 0)
	rect(0, 675, (player.health/entities[0].max_health) * 200, 15)
	stroke(0)
	strokeWeight(4)
	noFill()
	rect(0, 675, 200, 15)
	noStroke()
} 

// draws RESTART BUTTON in the middle of the screen if the player health is 0
function drawRestart() {
	//if the player health is 0, draw a button in the middle of the screen
	if (player.health <= 0) {
		fill(255)
		stroke(0)
		strokeWeight(4)
		rect(CANVAS_WIDTH/3,CANVAS_HEIGHT/2,CANVAS_WIDTH/3,200)
		noStroke()
		fill(0)
		textSize(32)
		text("Restart",CANVAS_WIDTH/3+70,CANVAS_HEIGHT/2+70)
	// draws the restart button in the corner
	}
}

//draws the QUICK SLOT for equiped in the bottom of the screen
function drawQuickslot() {
	fill(0)
	rect(0, CANVAS_HEIGHT-70, 250, 70)
	// draws the 4 slots
	for (let i = 0; i < 4; i++) {
		fill(255)
		if (player.selected == i)
			fill(100, 200, 200);
		rect(10 + i*60, CANVAS_HEIGHT-55, 50, 50)
		if (player.quickslot[i])
			image(itemset, 10 + i*60, CANVAS_HEIGHT-55, TILE_SIZE*1.5, TILE_SIZE*1.5, player.quickslot[i]*ITEM_SRC_SIZE, 0, ITEM_SRC_SIZE, ITEM_SRC_SIZE)
	} // draws the squares 4 times
	fill(125, 150, 150);
	rect(10 + 4*60, CANVAS_HEIGHT-45, 50, 50)
	fill(0);
	textSize(32);
	text(player.mana + "/" + entityStats[player.type].mana, 10 + 4*60, CANVAS_HEIGHT-35, 50, 50);
} // draws the quick slots in the bottom

// draws the SHOP if the player is close to the merchant
function drawShop() {
	if (Math.abs(player.x - merchant.x) < 5 && Math.abs(player.y - merchant.y) < 5 ) {
		shop.open = true
		fill(0)
		rect(100, 100, 350, 500)
		// has 6 vertical slots
		for (let i = 0; i < 6; i++) {
			fill(255)
			rect(110, 110 + i*80, 70, 70)
			
			if (i == inventory.selected) {
				fill(40, 60, 255);
				rect(110, 110 + i*80, 70, 70)
			} 

			if (merchant.quickslot[i]) 
				image(itemset, 110, 110 + i*80, 50, 50, merchant.quickslot[i]*ITEM_SRC_SIZE, 0, ITEM_SRC_SIZE, ITEM_SRC_SIZE)
			
		}
	} else {
		shop.open = false
	}
}

// display DAMAGE number for entities and player
function drawDamageMarker(damageMarker) {
	fill(damageMarker.color)
	textSize(15);
	let x = (damageMarker.entity.x-player.x-1+VIEWPORT_WIDTH/2)*TILE_SIZE;
	let y = (damageMarker.entity.y-player.y-1+VIEWPORT_HEIGHT/2)*TILE_SIZE;
	text(damageMarker.damage.toFixed(2), x, y-(millis()-damageMarker.time)/100, 100)
	fill(0,0,0)
} // displayes the damage numbers above the player/entity

//function to draw tile based on x & y loci
function drawTile(tile, x, y) {
	image(tileset, x, y, TILE_SIZE, TILE_SIZE, tile*TILE_SRC_SIZE, 0, TILE_SRC_SIZE, TILE_SRC_SIZE);
} // Draws a tile at (x, y)

//function to draw item based on item type and x & y loci
function drawItems(item, x, y) {
	let h = Math.floor(item/15); // get the height of the item in the sprite sheet
	let w = item % 15;
	image(itemset, x, y, TILE_SIZE, TILE_SIZE, w*ITEM_SRC_SIZE, h*ITEM_SRC_SIZE, ITEM_SRC_SIZE, ITEM_SRC_SIZE)
} // draws the item at the x & y


const VIEWPORT_WIDTH = 2 + CANVAS_WIDTH / TILE_SIZE; // How many tiles that fit in the screen plus 2 since so they don't white on the edges
const VIEWPORT_HEIGHT = 2 + CANVAS_HEIGHT / TILE_SIZE;

// draws the WORLD = TILE + ITEMS on designated x & y loci
function drawWorld(px, py) {
	for (let x = 0; x < VIEWPORT_WIDTH; x++) {
		for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
			let tile_x = Math.floor(x+px-VIEWPORT_WIDTH/2);
			if (tile_x < 0 || tile_x >= WORLD_WIDTH)	//check if tile is within widht
				continue
			let tile_y = Math.floor(y+py-VIEWPORT_HEIGHT/2);	//check if tile is within height
			if (tile_y < 0 || tile_y >= WORLD_HEIGHT)
				continue
			// draw tile from tile_y, tile_x at the screenspace converted position relative to player
			drawTile(tiles[tile_y][tile_x], (x-fract(px)-1)*TILE_SIZE, (y-fract(py)-1)*TILE_SIZE);

			const item = items[tile_y][tile_x];
			//check if there is an item in the tile
			// if yes then draw item on location
			if (item !== null) {
				drawItems(item, (x - fract(px) - 1) * TILE_SIZE, (y - fract(py) - 1) * TILE_SIZE);
			}
		}
	}

	// iterate through entities
	for (let i = 0; i < entities.length; i++)
		entities[i].draw();

	// iterate through current damageMarker array
	for (let i = 0; i < damageMarkers.length; i++)
		if (millis()-damageMarkers[i].time > 1000)
			damageMarkers.splice(i--, 1);
		else
			drawDamageMarker(damageMarkers[i]);

	
	fill(0, 0, 0, 0);
	// Shows the range of the current attack with weapon
	if (keyIsDown(SHIFT) ? inRangeSpecial(player.quickslot[player.selected], attack_x, attack_y) : inRange(player.quickslot[player.selected], attack_x, attack_y)) {
		stroke(100, 100, 255);
	}else {
		stroke(255, 100, 100);
	}

	// attack marker
	strokeWeight(8);
	rect((attack_x-fract(px)+VIEWPORT_WIDTH/2-1)*TILE_SIZE, (attack_y-fract(py)+VIEWPORT_HEIGHT/2-1)*TILE_SIZE, TILE_SIZE, TILE_SIZE)
	
	drawHealthbar()
	drawQuickslot()
	textAlign(LEFT);
	drawInvent()
	drawShop()
	drawRestart()

	// turn count on the screen
	textSize(32);
	fill(255);
	stroke(0);
	text(turnCount, 48, 32);
	text(level, 10, 32);
	
	noStroke()
} // draws the entire map


export { CANVAS_WIDTH, CANVAS_HEIGHT, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, TILE_SIZE, itemset, tileset, entitysheet, drawWorld, damageMarkers };
