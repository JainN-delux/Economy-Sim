import { isWalkable, generateWorld, tiles, generateEnemies } from "./generateWorld.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, tileset, entitysheet, drawWorld } from "./render.js";

import { entityAtTile, player, entities, statusTime, convertStatus, statusList, entityStats } from "./entity.js";
import { inventory, items, inRange, shop, itemStats, inRangeSpecial } from "./item.js";


//variables
let turnCount = 0;
let attack_x = 0;
let attack_y = 0;

function updateWorld() {
	//if enemy is on trap apply effect
	for (let i = 0; i < entities.length; i++) {
		if (tiles[entities[i].y][entities[i].x] > 16) {
			entities[i].effects[tiles[entities[i].y][entities[i].x]-17] += statusTime[tiles[entities[i].y][entities[i].x]-17];
			tiles[entities[i].y][entities[i].x] = 11; //reset tile to floor
		}
	}

	player.update();
	//turn based system
	for (let i = 1; i < entities.length; i++)
		entities[i].turn();
	if (turnCount % 250 == 0)
		generateEnemies();
	turnCount++;
}

function attackAt(e, x, y, key_shift) {
	if (player.effects[statusList.NULL] == 0 && player.effects[statusList.STUN] == 0) {
		if (player.quickslot[player.selected] == null) {
			player.attack(e);
			updateWorld();
		}
		else if (key_shift) {
			if (inRangeSpecial(player.quickslot[player.selected], x, y)) {
				if (player.mana >= itemStats[player.quickslot[player.selected]].special_mana)
					player.attack(e, true);
				updateWorld();
			}
		}
		else if (inRange(player.quickslot[player.selected], x, y)) {
			if (player.mana >= itemStats[player.quickslot[player.selected]].mana)
				player.attack(e);
			updateWorld();
		}
	}
}

//-------------------------KEYBOARD KEYS-------------------------
window.keyPressed = () => {
	// Key X / Inventory
	// if x is pressed and the inventory is not open 
	if (key === 'x') {
		inventory.toggle();
	}
	//move up
	if ((key == 'w' || key == 'W') && isWalkable[tiles[player.y-1][player.x]]) {
		let e = entityAtTile(player.x, player.y-1);
		if (e == null) {
			if (player.effects[statusList.VINES] == 0 && player.effects[statusList.STUN] == 0)
				player.y -= 1
			updateWorld();
		}
		else
			attackAt(e, 0, -1, key == 'W');
	}
	//move down
	if ((key == 's' || key == 'S') && isWalkable[tiles[player.y+1][player.x]]) {
		let e = entityAtTile(player.x, player.y+1);
		if (e == null) {
			if (player.effects[statusList.VINES] == 0 && player.effects[statusList.STUN] == 0)
				player.y += 1
			updateWorld();
		}
		else
			attackAt(e, 0, 1, key == 'S');
	}
	//move left
	if ((key == 'a' || key == 'A') && isWalkable[tiles[player.y][player.x-1]]) {
		let e = entityAtTile(player.x-1, player.y);
		if (e == null) {
			if (player.effects[statusList.VINES] == 0 && player.effects[statusList.STUN] == 0)
				player.x -= 1
			updateWorld();
		}
		else
			attackAt(e, -1, 0, key == 'A');
	}
	//move right
	if ((key == 'd' || key == 'D') && isWalkable[tiles[player.y][player.x+1]]) {
		let e = entityAtTile(player.x+1, player.y);
		if (e == null) {
			if (player.effects[statusList.VINES] == 0 && player.effects[statusList.STUN] == 0)
				player.x += 1
			updateWorld();
		}
		else
			attackAt(e, 1, 0, key == 'D');
	}
	if (key == 'e' || key == 'E') {
		let e = entityAtTile(player.x+attack_x, player.y+attack_y);
		if (e != null)
			attackAt(e, attack_x, attack_y, key == 'E');
	}
	if (key == 'o' || key == 'O') {
		if (items[player.y][player.x] != null) {
			inventory.add(items[player.y][player.x]);
			items[player.y][player.x] = null;
			updateWorld();
		}
	}
	if (key == '1' || key == '!')
		player.selected = 0;
	else if (key == '2' || key == '@')
		player.selected = 1;
	else if (key == '3' || key == '#')
		player.selected = 2;
	else if (key == '4' || key == '$')
		player.selected = 3;
	//reload
	else if (key == "r" ) {
		window.location.reload()
	}

	if (shop.open) {
		if (keyCode == UP_ARROW)
			shop.selection_up();
		else if (keyCode == DOWN_ARROW)
			shop.selection_down();
	} else if (inventory.open) {
		if (keyCode == UP_ARROW)
			inventory.selection_up();
		else if (keyCode == DOWN_ARROW)
			inventory.selection_down();
		else if (keyCode == LEFT_ARROW)
			inventory.selection_left();
		else if (keyCode == RIGHT_ARROW)
			inventory.selection_right();
	}
	else {
		if (keyCode == UP_ARROW)
			attack_y -= 1;
		else if (keyCode == DOWN_ARROW)
			attack_y += 1;
		else if (keyCode == LEFT_ARROW)
			attack_x -= 1;
		else if (keyCode == RIGHT_ARROW)
			attack_x += 1;
	}
	// use item in inventory
	if (keyCode == ENTER && inventory.items[inventory.selected] != null) {
		player.use(inventory.remove_selected());
		updateWorld();
	}
	if (keyCode == BACKSPACE && !inventory.open && player.quickslot[player.selected] != null) {
		inventory.add(player.quickslot.splice(player.selected, 1)[0]);
		updateWorld();
	}
	if (keyCode == BACKSPACE && inventory.open && inventory.items[inventory.selected] != null) {
		items[player.y][player.x] = inventory.remove_selected();
		updateWorld();
	}
}

//SETUP 
window.setup = () => {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	noSmooth(); // Turns off filter on images because we want clear pixel art
	generateWorld();
	

}
//mousclick
window.mouseClicked = () => {
	
	if (player.health >= 0) {
		if (mouseX >= CANVAS_WIDTH-50 && mouseY <= 50) {
			window.location. reload()
		}

	} else {
		window.location.reload()
	}
}

//DRAW
window.draw = () => {

	background(220);
	drawWorld(player.x, player.y);

	let h = 1;
	for (let i = 0; i < player.effects.length; i++) {
		if (player.effects[i] > 0) {
			fill(255, 0, 0, 50*(1/statusTime[i]))
			rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			textSize(32);
			fill(100)
			textAlign(CENTER);
			textFont('Courier New');
			text(`Effect: ${convertStatus(i)}      Time left: ${player.effects[i]}`, CANVAS_WIDTH/2 ,h*32);
			h++;
		}
	}
}

export { turnCount, attack_x, attack_y };
