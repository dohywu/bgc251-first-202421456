// sketch.js
let video, faceapi;
let detections = [];
let flameOn = false;
let wishText = '';
let hasBlown = false;
let typedMsg = '';
let charIndex = 0;
let typing = false;
let smokeParticles = [];
let fireworks = [];

const candleColors = ['#FFDDAA', '#A8E6CF', '#D0E1FF', '#FFE6A4', '#FFC0CB'];
let currentColorIndex = 0;

let wishInputDiv, wishLabel, wishInput, startButton;
let instructionText, messageText, resetButton, photoButton;
let prevColorBtn, nextColorBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupCamera();
  setupFaceAPI();
  setupUI();
}

function setupCamera() {
  video = createCapture(VIDEO);
  video.size(240, 180);
  video.hide();
}

function setupFaceAPI() {
  const options = {
    withLandmarks: true,
    withDescriptors: false,
    withExpressions: false,
  };
  faceapi = ml5.faceApi(video, options, modelReady);
}

function modelReady() {
  detectFaceLoop();
}

function detectFaceLoop() {
  if (!faceapi) return;
  faceapi.detect((err, result) => {
    if (!err && result) detections = result;
    setTimeout(detectFaceLoop, 100);
  });
}

function setupUI() {
  textFont('sans-serif');

  wishInputDiv = createDiv();
  wishInputDiv.style('position', 'absolute');
  wishInputDiv.style('left', '50%');
  wishInputDiv.style('top', '10%');
  wishInputDiv.style('transform', 'translateX(-50%)');
  wishInputDiv.style('text-align', 'center');

  wishLabel = createElement('label', '무엇을 위해 촛불을 끄고 싶나요?');
  wishLabel.parent(wishInputDiv);
  wishLabel.style('font-size', '1.2em');
  wishLabel.style('color', '#ff6f91');

  wishInput = createInput('');
  wishInput.parent(wishInputDiv);
  wishInput.style('font-size', '1.2em');
  wishInput.style('padding', '10px 15px');
  wishInput.style('width', '280px');
  wishInput.style('border-radius', '12px');
  wishInput.style('border', '2px solid #ffccda');
  wishInput.style('background-color', '#fff0f5');
  wishInput.style('margin-bottom', '20px');

  startButton = createButton('🔥 불 붙이기');
  startButton.parent(wishInputDiv);
  startButton.style('font-size', '1.2em');
  startButton.style('padding', '10px 15px');
  startButton.style('background-color', '#ffb6c1');
  startButton.style('color', 'white');
  startButton.style('border-radius', '12px');
  startButton.mousePressed(startCandle);

  instructionText = createP('입을 벌려 촛불을 꺼보세요');
  instructionText.style('position', 'absolute');
  instructionText.style('left', '50%');
  instructionText.style('top', 'calc(50.5vh - 240px - 30px)');
  instructionText.style('transform', 'translateX(-50%)');
  instructionText.style('font-size', '1em');
  instructionText.style('color', '#121212');

  messageText = createP('');
  messageText.style('position', 'absolute');
  messageText.style('left', '50%');
  messageText.style('top', '20%');
  messageText.style('transform', 'translateX(-50%)');
  messageText.style('font-size', '2em');
  messageText.style('color', '#ff4081');
  messageText.hide();

  resetButton = createButton('다시 켜기');
  resetButton.style('position', 'absolute');
  resetButton.style('left', '50%');
  resetButton.style('top', '65%');
  resetButton.style('transform', 'translateX(-50%)');
  resetButton.style('font-size', '1.2em');
  resetButton.style('padding', '10px 20px');
  resetButton.style('background-color', '#a0e7e5');
  resetButton.style('color', '#333');
  resetButton.style('border-radius', '12px');
  resetButton.mousePressed(resetCandle);
  resetButton.hide();

  photoButton = createButton('📸 사진 찍기');
  photoButton.mousePressed(() => saveCanvas('snapshot', 'png'));
  photoButton.style('position', 'absolute');
  photoButton.style('left', '50%');
  photoButton.style('top', '72%');
  photoButton.style('transform', 'translateX(-50%)');

  prevColorBtn = createButton('◀');
  nextColorBtn = createButton('▶');
  prevColorBtn.mousePressed(() => changeColor(-1));
  nextColorBtn.mousePressed(() => changeColor(1));
}

function draw() {
  background('#ffeef4');
  drawVideo();
  drawBirthdayHat();
  if (flameOn && mouthOpen()) {
    flameOn = false;
    hasBlown = true;
    fireworks.push(new Firework(width / 2, height / 2 - 30));
    setTimeout(() => {
      showMessage(`✨ "${wishText}"을(를) 위한 불을 껐어요! ✨`);
      resetButton.show();
    }, 500);
  }
  drawCandle();
  updateSmoke();
  updateFireworks();
  typeMessage();
  updateColorButtonPosition();
}

function drawVideo() {
  const vidW = 240,
    vidH = 180;
  const vidX = width / 2 - vidW / 2;
  const vidY = height / 2 - 60 - vidH;
  if (video && video.loadedmetadata) {
    push();
    translate(vidX + vidW, vidY);
    scale(-1, 1);
    image(video, 0, 0, vidW, vidH);
    pop();
  }
}

function drawBirthdayHat() {
  if (!detections.length) return;
  const parts = detections[0].parts;
  const x = (parts.leftEye[0]._x + parts.rightEye[3]._x) / 2;
  const y = (parts.leftEye[0]._y + parts.rightEye[3]._y) / 2 - 100;
  const cx = width / 2 - (x - 120);
  const cy = height / 2 - 60 - 180 + y;
  push();
  noStroke();
  fill('#ff5d8f');
  triangle(cx, cy, cx - 25, cy + 60, cx + 25, cy + 60);
  fill('#ffff66');
  ellipse(cx, cy - 10, 15);
  pop();
}

function drawCandle() {
  noStroke();
  fill(candleColors[currentColorIndex]);
  rect(width / 2 - 15, height / 2 + 40, 30, 80, 10);
  fill(80);
  rect(width / 2 - 2, height / 2, 4, 40);
  if (flameOn) {
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

function updateColorButtonPosition() {
  const y = height / 2 + 40 + 80 + 10;
  prevColorBtn.position(width / 2 - 40, y);
  nextColorBtn.position(width / 2 + 10, y);
}

function updateSmoke() {
  if (!flameOn && hasBlown) {
    smokeParticles.forEach((s, i) => {
      s.update();
      s.display();
      if (s.isFinished()) smokeParticles.splice(i, 1);
    });
    if (frameCount % 5 === 0)
      smokeParticles.push(new Smoke(width / 2, height / 2 - 10));
  }
}

function updateFireworks() {
  fireworks.forEach((fw, i) => {
    fw.update();
    fw.show();
    if (fw.done()) fireworks.splice(i, 1);
  });
}

function typeMessage() {
  if (typing && charIndex < typedMsg.length && frameCount % 4 === 0) {
    messageText.html(messageText.html() + typedMsg[charIndex++]);
  }
}

function startCandle() {
  wishText = wishInput.value() || '12월 11일 현우 생일';
  wishInputDiv.hide();
  flameOn = true;
}

function resetCandle() {
  flameOn = true;
  hasBlown = false;
  messageText.hide();
  resetButton.hide();
  wishInput.value('');
  wishInputDiv.show();
  typing = false;
  charIndex = 0;
  smokeParticles = [];
}

function showMessage(msg) {
  messageText.html('');
  messageText.show();
  typedMsg = msg;
  charIndex = 0;
  typing = true;
}

function mouthOpen() {
  if (!detections.length) return false;
  const m = detections[0].parts.mouth;
  return dist(m[13]._x, m[13]._y, m[19]._x, m[19]._y) > 8;
}

function changeColor(dir) {
  currentColorIndex =
    (currentColorIndex + dir + candleColors.length) % candleColors.length;
}

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
  }
  display() {
    noStroke();
    fill(200, 200, 200, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
  isFinished() {
    return this.alpha <= 0;
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
    this.particles = [];
    this.color = color(random(255), random(255), random(255));
    for (let i = 0; i < 200; i++) {
      this.particles.push(new Particle(x, y, this.color));
    }
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
