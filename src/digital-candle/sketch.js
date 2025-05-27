let video, faceapi;
let detections = [];
let flameOn = false;
let wishText = '';
let hasBlown = false;
let messageElement,
  inputDiv,
  resetButton,
  photoButton,
  prevColorBtn,
  nextColorBtn;
let typedMsg = '';
let charIndex = 0;
let typing = false;
let smokeParticles = [];
let fireworks = []; // 폭죽 배열

// 촛불 커스터마이징 옵션
const candleColors = ['#FFDDAA', '#A8E6CF', '#D0E1FF', '#FFE6A4', '#FFC0CB'];
let currentColorIndex = 0;

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
  faceapi = ml5.faceApi(video, options, () => getFace());

  // DOM 요소 가져오기
  messageElement = select('#message').elt;
  inputDiv = select('#wish-input').elt;
  resetButton = select('#reset-button').elt;

  // 사진 찍기 버튼
  photoButton = createButton('📸 사진 찍기');
  photoButton.mousePressed(takePhoto);
  positionPhotoButton();
  window.addEventListener('resize', positionPhotoButton);

  // 촛불 색 선택 버튼
  prevColorBtn = createButton('◀');
  nextColorBtn = createButton('▶');
  prevColorBtn.mousePressed(() => changeColor(-1));
  nextColorBtn.mousePressed(() => changeColor(1));
  positionColorButtons();
  window.addEventListener('resize', positionColorButtons);
};

// 버튼 위치 재조정: '다시 켜기' 아래 사진 버튼
function positionPhotoButton() {
  const rect = resetButton.getBoundingClientRect();
  photoButton.position(
    rect.left + window.scrollX,
    rect.bottom + window.scrollY + 10
  );
}

// 버튼 위치: 화면 왼쪽 상단에 커스터마이징 버튼
// 버튼 위치: 촛대(캔들) 바로 아래에 색상 변경 버튼 배치
function positionColorButtons() {
  // 캔들 위치 계산: 캔들 top-left (width/2-15, height/2+40), 높이 80
  const x = width / 2 - 30; // ◀ 버튼 x 좌표
  const y = height / 2 + 40 + 80 + 10; // 캔들 하단에서 10px 여백
  prevColorBtn.position(x, y);
  nextColorBtn.position(x + 40, y);
}

// 색상 변경
function changeColor(dir) {
  currentColorIndex =
    (currentColorIndex + dir + candleColors.length) % candleColors.length;
}

window.startCandle = function () {
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

  // 비디오 창
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

  // 모자 → 입 벌림 감지
  drawBirthdayHat(vidX, vidY, vidW, vidH);
  if (flameOn && mouthOpen()) {
    flameOn = false;
    hasBlown = true;
    fireworks.push(new Firework(width / 2, height / 2 - 30));
    setTimeout(() => {
      startMessage(`✨ "${wishText}"을(를) 위한 불을 껐어요! ✨`);
      resetButton.style.display = 'block';
      positionPhotoButton();
    }, 500);
  }

  drawCandle();

  // 연기
  if (!flameOn && hasBlown) {
    smokeParticles.forEach((s, i) => {
      s.update();
      s.display();
      if (s.isFinished()) smokeParticles.splice(i, 1);
    });
    if (frameCount % 5 === 0)
      smokeParticles.push(new Smoke(width / 2, height / 2 - 10));
  }

  // 폭죽
  fireworks.forEach((fw, i) => {
    fw.update();
    fw.show();
    if (fw.done()) fireworks.splice(i, 1);
  });

  // 메시지 타이핑
  if (typing && charIndex < typedMsg.length && frameCount % 4 === 0)
    messageElement.innerText += typedMsg[charIndex++];
};

function drawBirthdayHat(x, y, w, h) {
  if (!detections.length) return;
  const parts = detections[0].parts;
  const eye = (parts.leftEye[0]._x + parts.rightEye[3]._x) / 2;
  const ex = x + (w - eye),
    ey = y + (parts.leftEye[0]._y + parts.rightEye[3]._y) / 2 - 100;
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
  // 바디 색상 선택 가능
  fill(candleColors[currentColorIndex]);
  rect(width / 2 - 15, height / 2 + 40, 30, 80, 10);
  // 심지 굵기 기본 4px
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
    for (let i = 0; i < 200; i++)
      this.particles.push(new Particle(x, y, this.color));
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
