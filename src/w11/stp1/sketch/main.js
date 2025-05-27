let balls = [];

function setup() {
  createCanvas(400, 400);
  for (let n = 0; n < 20; n++) {
    let randomR = random(20, 50);
    let randomX = random(randomR, width - randomR);
    let randomY = random(-2 * randomR, height - randomR);
    let aBall = new Ball(randomX, randomY, randomR);
    balls.push(aBall);
  }
}

function draw() {
  background('red');
  for (let idx = 0; idx < balls.length; idx++) {
    let aBall = balls[idx];
    aBall.applyGravity(0, 1);
    for (let subIdx = idx + 1; subIdx < balls.length; subIdx++) {
      let other = balls[subIdx];
      aBall.collide(other);
    }
    aBall.update();
    aBall.wall();
    aBall.render();
  }
}
