function drawOrbitDots() {
  let s = second();
  let angle = map(s, 0, 60, 0, 360);
  let r = min(width, height) * 0.35;

  let x = width / 2 + cos(angle - 90) * r;
  let y = height / 2 + sin(angle - 90) * r;

  fill(0, 0, 100);
  noStroke();
  ellipse(x, y, 20);

  // 트레일 효과
  for (let i = 1; i < 10; i++) {
    let trailAngle = angle - i * 6;
    let tx = width / 2 + cos(trailAngle - 90) * r;
    let ty = height / 2 + sin(trailAngle - 90) * r;
    fill(0, 0, 100, map(i, 1, 10, 80, 10));
    ellipse(tx, ty, 20 - i);
  }
}
