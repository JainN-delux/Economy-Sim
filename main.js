import { isWalkable, generateWorld, tiles, generateEnemies } from "./generateWorld.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, tileset, entitysheet, drawWorld } from "./render.js";
import { entityAtTile, player, entities, statusTime,convertStatus } from "./entity.js";
import { inventory, items, inRange } from "./item.js";

//variables
let turnCount = 0;
let attack_x = 0;
let attack_y = 0;

function updateWorld() {
	//if enemy is on trap apply effect
	for (let i = 0; i < entities.length; i++) {
		if (tiles[entities[i].y][entities[i].x] > 16) {
			let list = [(tiles[entities[i].y][entities[i].x]-17),(statusTime[tiles[entities[i].y][entities[i].x]-17])]
			entities[i].currentEffects.push(list);	
			tiles[entities[i].y][entities[i].x] = 11; //reset tile to floor
		}
	}

	player.returnBase();
	player.regen(0.01);
	player.effects();
	//turn based system
	for (let i = 1; i < entities.length; i++)
		entities[i].turn();
	if (turnCount % 250 == 0)
		generateEnemies();
	turnCount++;
}

//-------------------------KEYBOARD KEYS-------------------------
window.keyPressed = () => {
	
	// Key X / Inventory
	// if x is pressed and the inventory is not open 
	if (key === 'x') {
		inventory.toggle();
	}
	//move up
	if (key == 'w' && isWalkable[tiles[player.y-1][player.x]]) {
		let e = entityAtTile(player.x, player.y-1);
		if (e == null)
			player.y -= 1
		else
			player.attack(e);
		updateWorld();
	}
	//move down
	if (key == 's' && isWalkable[tiles[player.y+1][player.x]]) {
		let e = entityAtTile(player.x, player.y+1);

		if (e == null)
			player.y += 1
		else
			player.attack(e);
		updateWorld();
	}
	//move left
	if (key == 'a' && isWalkable[tiles[player.y][player.x-1]]) {
		let e = entityAtTile(player.x-1, player.y);
		if (e == null)
			player.x -= 1
		else
			player.attack(e);
		updateWorld();
	}
	//move right
	if (key == 'd' && isWalkable[tiles[player.y][player.x+1]]) {
		let e = entityAtTile(player.x+1, player.y);
		if (e == null)
			player.x += 1
		else
			player.attack(e);
		updateWorld();
	}
	if (key == 'e') {
		let e = entityAtTile(player.x+attack_x, player.y+attack_y);
		if (e != null) {
			if (inRange(player.quickslot[player.selected], attack_x, attack_y)) {
				player.attack(e);
				updateWorld();
			}
		}
	}
	if (key == 'o') {
		if (items[player.y][player.x] != null) {
			inventory.add(items[player.y][player.x]);
			items[player.y][player.x] = null;
			updateWorld();
		}
	}
	if (key == '1')
		player.selected = 0;
	else if (key == '2')
		player.selected = 1;
	else if (key == '3')
		player.selected = 2;
	else if (key == '4')
		player.selected = 3;
	//reload
	else if (key == "r" ) {
		window.location.reload()
	}

	if (inventory.open) {
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
	let h = 1 
	for (let effect in player.currentEffects) {
		if (player.currentEffects[effect][1] > 0) {
			let type = player.currentEffects[effect][0];
			let time = player.currentEffects[effect][1];
			fill(255, 0, 0, 50*(1/statusTime[type]))
			rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			textSize(32);
			fill(100)
			textAlign(CENTER);
			textFont('Courier New');
			text(`Effect: ${convertStatus(type)}      Time left: ${time}`, CANVAS_WIDTH/2 ,h*32);
			h++

		}
	}
}

export { turnCount, attack_x, attack_y };
