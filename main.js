let img;


/** This is a setup function. */
function setup() {
  createCanvas(400, 400); 
  img = loadImage('/assets/iso-64x64-outside.png');
  

}

/** This is a draw function. */
function draw() {
  background(220);
  rect(100, 100, 100, 100)

  // Draw the image.
  image(img, 0, 0);

}
