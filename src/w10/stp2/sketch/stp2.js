let palettes = ['#102E50', '#F5C45E', '#E78B48', '#BE3D2A'];

let particles = [];

function createParticle(x, y) {
  let randomPalIdx = floor(random(palettes.length));
  let randomAngleDeg = random(360);
  let aParticle = new Particle(
    x,
    y,
    20,
    palettes[randomPalIdx],
    randomAngleDeg,
    5
  );
  particles.push(aParticle);
}

function setup() {
  createCanvas(400, 400);

  for (let cnt = 0; cnt < 10; cnt++) {
    createParticle(random(width), random(height));
  }
}

function draw() {
  background(220);

  for (let idx = 0; idx < particles.length; idx++) {
    particles[idx].update();
    particles[idx].bounding();
    particles[idx].render();
  }
}
