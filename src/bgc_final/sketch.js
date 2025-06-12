let camera;
let sampleSize = 5;
let camWidth = 320;
let camHeight = 240;
let threshold = 500;
let multiplier;
let thresholdSlider;

function setup() {
  camera = createCapture(VIDEO, { flipped: true });
  camera.size(camWidth, camHeight);
  camera.hide();

  if (windowHeight < windowWidth) {
    createCanvas(round((windowHeight * camWidth) / camHeight), windowHeight);
  } else {
    createCanvas(windowWidth, round(windowHeight * (camHeight / camWidth)));
  }

  multiplier = width / camWidth;

  thresholdSlider = createSlider(0, 765, threshold);
  thresholdSlider.position(width / 2 - 100, height - 60);
  thresholdSlider.style('width', '200px');

  rectMode(CORNER);
  noStroke(); // 기본값
}

function draw() {
  background(0);
  camera.loadPixels();

  for (let y = 0; y < camHeight; y += sampleSize) {
    for (let x = 0; x < camWidth; x += sampleSize) {
      let index = (x + y * camWidth) * 4;
      let r = camera.pixels[index];
      let g = camera.pixels[index + 1];
      let b = camera.pixels[index + 2];
      let brightness = r + g + b;

      let px = x * multiplier;
      let py = y * multiplier;

      if (brightness < thresholdSlider.value()) {
        let fillCol = map(brightness, 0, thresholdSlider.value(), 255, 50);
        fill(fillCol);
        rect(px, py, sampleSize * multiplier, sampleSize * multiplier);
      }
    }
  }
}
