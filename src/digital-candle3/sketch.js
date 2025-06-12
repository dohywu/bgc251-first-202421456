let video,
  faceapi,
  detections = [];
let flameOn = false,
  hasBlown = false,
  typing = false;
let smokeParticles = [],
  fireworks = [];
let wishText = '',
  typedMsg = '',
  charIndex = 0;
let messageElement, inputDiv;

let currentColorIndex = 0;

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(240, 180);
  video.hide();

  faceapi = ml5.faceApi(
    video,
    {
      withLandmarks: true,
      withDescriptors: false,
      withExpressions: false,
    },
    () => faceapi.detect(gotFace)
  );

  messageElement = select('#message').elt;
  inputDiv = select('#wish-input').elt;
};

function gotFace(err, result) {
  if (!err && result) detections = result;
  setTimeout(() => faceapi.detect(gotFace), 100);
}

window.draw = function () {
  background('#ffeef4');

  // 영상
  const vidW = 240,
    vidH = 180,
    vidX = width / 2 - vidW / 2,
    vidY = height / 2 - 60 - vidH;
  if (video && video.loadedmetadata) {
    push();
    translate(vidX + vidW, vidY);
    scale(-1, 1);
    image(video, 0, 0, vidW, vidH);
    pop();
  }

  drawBirthdayHat(vidX, vidY, vidW, vidH);

  if (flameOn && mouthOpen()) {
    flameOn = false;
    hasBlown = true;
    fireworks.push(new Firework(width / 2, height / 2 - 30));
    setTimeout(
      () => startMessage(`✨ "${wishText}"을(를) 위한 불을 껐어요! ✨`),
      500
    );
  }

  drawCandle();

  if (!flameOn && hasBlown) {
    if (frameCount % 5 === 0)
      smokeParticles.push(new Smoke(width / 2, height / 2 - 10));
    smokeParticles = smokeParticles.filter((p) => !p.update());
  }

  fireworks = fireworks.filter((fw) => {
    fw.update();
    fw.show();
    return !fw.done();
  });

  if (typing && charIndex < typedMsg.length && frameCount % 4 === 0) {
    messageElement.innerText += typedMsg[charIndex++];
  }
};

function drawBirthdayHat(x, y, w, h) {
  if (!detections.length) return;
  const parts = detections[0].parts;
  const eyeX = (parts.leftEye[0]._x + parts.rightEye[3]._x) / 2;
  const eyeY = (parts.leftEye[0]._y + parts.rightEye[3]._y) / 2;
  const ex = x + (w - eyeX),
    ey = y + eyeY - 100;

  push();
  noStroke();
  fill('#ff5d8f');
  triangle(ex, ey, ex - 25, ey + 60, ex + 25, ey + 60);
  fill('#ffff66');
  ellipse(ex, ey - 10, 15);
  pop();
}

function drawCandle() {
  noStroke();
  fill('#FFDDAA');
  rect(width / 2 - 15, height / 2 + 40, 30, 80, 10);

  fill(80);
  rect(width / 2 - 2, height / 2, 4, 40);

  if (flameOn) {
    noStroke();
    fill(255, 220, 100, 80);
    ellipse(width / 2, height / 2 - 30 + random(-2, 2), 50, 70);
    fill(255, 160, 0, 150);
    ellipse(width / 2, height / 2 - 35 + random(-1.5, 1.5), 35, 55);
    fill(255, 90, 0, 200);
    ellipse(width / 2, height / 2 - 42 + random(-1, 1), 20, 30);
    fill(255, 255, 255, 180);
    ellipse(width / 2 + random(-2, 2), height / 2 - 50 + random(-2, 2), 6, 10);
  }
}

function mouthOpen() {
  if (!detections.length) return false;
  const m = detections[0].parts.mouth;
  return dist(m[13]._x, m[13]._y, m[19]._x, m[19]._y) > 8;
}

window.startCandle = function () {
  wishText = select('#wish').elt.value;
  inputDiv.style.display = 'none';
  flameOn = true;
};

function startMessage(msg) {
  messageElement.innerText = '';
  messageElement.style.display = 'block';
  typedMsg = msg;
  charIndex = 0;
  typing = true;
}

// 클래스 정의
class Smoke {
  constructor(x, y) {
    this.x = x + random(-5, 5);
    this.y = y;
    this.alpha = 255;
    this.size = random(10, 20);
    this.speed = random(0.5, 1.5);
  }
  update() {
    this.y -= this.speed;
    this.alpha -= 2;
    this.display();
    return this.alpha <= 0;
  }
  display() {
    noStroke();
    fill(200, 200, 200, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

class Particle {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(random(TWO_PI)).mult(random(3, 8));
    this.acc = createVector(0, 0.1);
    this.lifespan = 255;
    this.color = color;
    this.size = random(6, 12);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 4;
  }
  show() {
    noStroke();
    fill(
      this.color.levels[0],
      this.color.levels[1],
      this.color.levels[2],
      this.lifespan
    );
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  done() {
    return this.lifespan <= 0;
  }
}

class Firework {
  constructor(x, y) {
    this.particles = Array.from(
      { length: 200 },
      () => new Particle(x, y, color(random(255), random(255), random(255)))
    );
  }
  update() {
    this.particles.forEach((p) => p.update());
  }
  show() {
    this.particles.forEach((p) => p.show());
  }
  done() {
    return this.particles.every((p) => p.done());
  }
}
