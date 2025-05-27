function drawHourHalo() {
  let h = hour();
  let size = map(h % 12, 0, 11, 100, width * 0.8);

  push();
  translate(width / 2, height / 2);
  noFill();
  stroke(60, 50, 100, 30);
  strokeWeight(2);
  ellipse(0, 0, size, size);
  pop();
}
