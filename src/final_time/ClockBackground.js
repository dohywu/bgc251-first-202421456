function drawClockBackground() {
  let h = hour();
  let hue = map(h, 0, 23, 0, 360);
  background(hue, 30, 15);
}
