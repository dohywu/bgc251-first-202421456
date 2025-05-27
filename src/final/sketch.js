function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);
  noCursor(); // 커서 숨김
}

function draw() {
  drawClockBackground();
  drawHourHalo();
  drawMinuteWaves();
  drawOrbitDots();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
