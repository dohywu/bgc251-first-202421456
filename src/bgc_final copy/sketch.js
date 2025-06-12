let video;
let sampleSize = 1;
let camWidth = 64;
let camHeight = 48;
let bitmap = 380;
let pixelScale;

function setup() {
  video = createCapture(VIDEO);
  video.hide(true);
  video.size(camWidth, camHeight);

  if (windowHeight < windowWidth) {
    createCanvas(round((windowHeight * camWidth) / camHeight), windowHeight);
  } else {
    createCanvas(windowWidth, round((windowHeight * camHeight) / camWidth));
  }

  pixelScale = width / camWidth;

  rectMode(CORNER);
  noStroke();
}

function draw() {
  background(0);
  video.loadPixels();

  bitmap = map(mouseX, 0, width, 0, 765);
  bitmap = constrain(bitmap, 0, 765);

  for (let y = 0; y < camHeight; y += sampleSize) {
    for (let x = 0; x < camWidth; x += sampleSize) {
      let index = (x + y * camWidth) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let brightness = r + g + b;

      let px = x * pixelScale;
      let py = y * pixelScale;

      if (brightness < bitmap) {
        let fillColumn = map(brightness, 0, bitmap, 255, 50);
        fill(fillColumn);
        rect(px, py, sampleSize * pixelScale, sampleSize * pixelScale);
      }
    }
  }
}
