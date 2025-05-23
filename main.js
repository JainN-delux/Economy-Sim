import { isWalkable, generateWorld, tiles } from "./generateWorld.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, tileset, entitysheet, drawWorld } from "./render.js";
import { entityAtTile, player, entities,statusTime}  from "./entity.js";
import { inventory, items} from "./item.js";

//variables
let turnCount = 0;

let active = [] // stores active status effect on player


function updateWorld() {
	//add items to inventory when player collides
	if (items[player.y][player.x] != null) {
		inventory.add(items[player.y][player.x]);
		
		items[player.y][player.x] = null;
	}
	player.returnBase();
	//turn based system
	for (let i = 1; i < entities.length; i++)
		entities[i].turn();
	turnCount++;
}

function EffectRun(n) {
	curr = turnCount
	target = turnCount+n
	if (turnCount != curr ) {
		if (curr != target) {
			curr++
			return ture
		}
	}
	else {
		return false
	}
}


//-------------------------KEYBOARD KEYS-------------------------
window.keyPressed = () => {
	// Key X / Inventory
	// if x is pressed and the inventory is not open 
	if (key === 'x') {
		inventory.toggle();
		console.log(player.x,player.y)
	}
	//move up
	if (key == 'w' && isWalkable[tiles[player.y-1][player.x]]) {
		let e = entityAtTile(player.x, player.y-1);
		if (e == null)
			player.y -= 1
		else
			player.attack(e);
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

	//toggling inventory 
	if (keyCode == UP_ARROW)
		inventory.selection_up();
	else if (keyCode == DOWN_ARROW)
		inventory.selection_down();
	else if (keyCode == LEFT_ARROW)
		inventory.selection_left();
	else if (keyCode == RIGHT_ARROW)
		inventory.selection_right();
	//use item in inversntory
	else if (keyCode == ENTER && inventory.items[inventory.selected] != null) {
		player.use(inventory.remove_selected());
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
	
}

export { turnCount };
