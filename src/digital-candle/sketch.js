let video, faceapi;
let detections = [];
let flameOn = false;
let wishText = '';
let hasBlown = false;
let messageElement, inputDiv, resetButton, photoButton;
let typedMsg = '';
let charIndex = 0;
let typing = false;
let smokeParticles = [];
let fireworks = []; // 폭죽 배열

window.setup = function () {
  createCanvas(windowWidth, windowHeight);

  // 비디오 스트림 및 FaceAPI 초기화
  video = createCapture(VIDEO);
  video.size(240, 180);
  video.hide();

  const options = {
    withLandmarks: true,
    withDescriptors: false,
    withExpressions: false,
  };
  faceapi = ml5.faceApi(video, options, () => {
    console.log('FaceAPI ready');
    getFace();
  });

  // DOM 요소 가져오기
  messageElement = select('#message').elt;
  inputDiv = select('#wish-input').elt;
  resetButton = select('#reset-button').elt;

  // 사진 촬영 버튼 생성 및 위치 설정
  photoButton = createButton('📸 사진 찍기');
  photoButton.mousePressed(takePhoto);
  positionPhotoButton();
  window.addEventListener('resize', positionPhotoButton);
};

// '다시 켜기' 버튼 아래에 사진 버튼 위치
function positionPhotoButton() {
  const rect = resetButton.getBoundingClientRect();
  const x = rect.left + window.scrollX;
  const y = rect.bottom + window.scrollY + 10;
  photoButton.position(x, y);
}

window.startCandle = function () {
  // 소원 가져오기 및 촛불 On
  wishText = select('#wish').elt.value || '소중한 순간';
  inputDiv.style.display = 'none';
  flameOn = true;
};

function getFace() {
  if (!faceapi) return;
  faceapi.detect((err, result) => {
    if (!err && result) detections = result;
    setTimeout(getFace, 100);
  });
}

window.draw = function () {
  background('#ffeef4');

  // 비디오 창 크기 및 위치
  const vidW = 240,
    vidH = 180;
  const vidX = width / 2 - vidW / 2;
  const vidY = height / 2 - 60 - vidH;

  // 영상 출력 (좌우 반전)
  if (video && video.loadedmetadata) {
    push();
    translate(vidX + vidW, vidY);
    scale(-1, 1);
    image(video, 0, 0, vidW, vidH);
    pop();
  }

  // 모자 → 입 벌림 감지
  drawBirthdayHat(vidX, vidY, vidW, vidH);
  if (flameOn && mouthOpen()) {
    console.log('입 벌림 감지됨 — 촛불 끔');
    flameOn = false;
    hasBlown = true;
    // 폭죽 발사
    const fx = width / 2;
    const fy = height / 2 - 30;
    fireworks.push(new Firework(fx, fy));

    setTimeout(() => {
      startMessage(`✨ "${wishText}"을(를) 위한 불을 껐어요! ✨`);
      resetButton.style.display = 'block';
      positionPhotoButton();
    }, 500);
  }

  drawCandle();

  // 연기 이펙트
  if (!flameOn && hasBlown) {
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      smokeParticles[i].update();
      smokeParticles[i].display();
      if (smokeParticles[i].isFinished()) smokeParticles.splice(i, 1);
    }
    if (frameCount % 5 === 0)
      smokeParticles.push(new Smoke(width / 2, height / 2 - 10));
  }

  // 폭죽 업데이트 및 표시
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) fireworks.splice(i, 1);
  }

  // 메시지 타이핑 효과
  if (typing && charIndex < typedMsg.length && frameCount % 4 === 0) {
    messageElement.innerText += typedMsg[charIndex++];
  }
};

function drawBirthdayHat(vidX, vidY, vidW, vidH) {
  if (!detections.length) return;
  const parts = detections[0].parts;
  const l = parts.leftEye[0],
    r = parts.rightEye[3];
  const eyeX = (l._x + r._x) / 2;
  const eyeY = (l._y + r._y) / 2;
  const hatX = vidX + (vidW - eyeX);
  const hatY = vidY + eyeY - 100;

  push();
  noStroke();
  fill('#ff5d8f');
  triangle(hatX, hatY, hatX - 25, hatY + 60, hatX + 25, hatY + 60);
  fill('#ffff66');
  ellipse(hatX, hatY - 10, 15);
  pop();
}

function drawCandle() {
  noStroke();
  fill(255, 240, 200);
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
  const d = dist(m[13]._x, m[13]._y, m[19]._x, m[19]._y);
  return d > 8;
}

// 사진 찍기
function takePhoto() {
  saveCanvas('snapshot', 'png');
}

function startMessage(msg) {
  messageElement.innerText = '';
  messageElement.style.display = 'block';
  typedMsg = msg;
  charIndex = 0;
  typing = true;
}

window.resetCandle = function () {
  flameOn = true;
  hasBlown = false;
  messageElement.style.display = 'none';
  resetButton.style.display = 'none';
  select('#wish').elt.value = '';
  inputDiv.style.display = 'block';
  typing = false;
  smokeParticles = [];
};

// 연기
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

// 폭죽 파티클 클래스
class Particle {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    const angle = random(TWO_PI);
    const speed = random(3, 8);
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
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

// 폭죽 클래스
class Firework {
  constructor(x, y) {
    this.particles = [];
    this.color = color(random(255), random(255), random(255));
    for (let i = 0; i < 200; i++)
      this.particles.push(new Particle(x, y, this.color));
  }
  update() {
    for (let p of this.particles) p.update();
  }
  show() {
    for (let p of this.particles) p.show();
  }
  done() {
    return this.particles.every((p) => p.done());
  }
}
