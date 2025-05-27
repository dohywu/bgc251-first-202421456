function drawMinuteWaves() {
  let m = minute();
  let waveCount = 5;
  let amplitude = map(m, 0, 59, 10, 100);
  let freq = 0.05;

  noFill();
  stroke(200, 50, 100, 20);
  strokeWeight(1);

  for (let i = 0; i < waveCount; i++) {
    beginShape();
    for (let x = 0; x < width; x += 10) {
      let y =
        height / 2 + sin(x * freq + frameCount * 0.02 + i * 30) * amplitude;
      vertex(x, y);
    }
    endShape();
  }
}
