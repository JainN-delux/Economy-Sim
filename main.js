let tileset;

function preload() {
	tileset = loadImage("/assets/tileset.png");
}

/** This is a setup function. */
function setup() {
	createCanvas(400, 400);
}

/** Something like this for tile drawing */
function drawTile(tile, x, y) {
	image(tileset, x, y, 64, 64, 64*(tile % 9), 64*Math.floor(tile / 9), 64, 64)
}

/** This is a draw function. */
function draw() {
	background(220);
	rect(100, 100, 100, 100)

	drawTile(0, 0, 0)
}
