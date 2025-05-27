let video, faceapi;
let detections = [];
let flameOn = false;
let wishText = '';
let hasBlown = false;
let messageElement, inputDiv, resetButton;
let typedMsg = '';
let charIndex = 0;
let typing = false;
let smokeParticles = [];

window.setup = function () {
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  createCanvas(windowWidth, windowHeight);
  messageElement = document.getElementById('message');
  inputDiv = document.getElementById('wish-input');
  resetButton = document.getElementById('reset-button');
};

window.startCandle = function () {
  wishText = document.getElementById('wish').value || '소중한 순간';
  inputDiv.style.display = 'none';
  flameOn = true;

  video = createCapture(VIDEO);
  video.size(width, height);
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
};

function getFace() {
  faceapi.detect((err, result) => {
    detections = result;
    setTimeout(getFace, 100);
  });
}

window.draw = function () {
  background(0); // 화면 지우기

  // 영상 보여주기 (불꽃 뒤쪽에)
  if (video && video.loadedmetadata) {
    let vidW = 240;
    let vidH = 180;
    let vidX = width / 2 - vidW / 2;
    let vidY = height / 2 - 60 - vidH; // 촛대 위쪽에 위치
    image(video, vidX, vidY, vidW, vidH);
  }

  drawCandle(); // 초는 항상 그려

  if (flameOn && mouthOpen()) {
    flameOn = false;
    hasBlown = true;
    setTimeout(() => {
      startMessage(`✨ "${wishText}"을(를) 위한 불을 껐어요! ✨`);
      resetButton.style.display = 'block';
    }, 500);
  }

  if (!flameOn && hasBlown) {
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      smokeParticles[i].update();
      smokeParticles[i].display();
      if (smokeParticles[i].isFinished()) {
        smokeParticles.splice(i, 1);
      }
    }
    if (frameCount % 5 === 0) {
      smokeParticles.push(new Smoke(width / 2, height / 2 - 10));
    }
  }

  if (typing) {
    if (frameCount % 4 === 0 && charIndex < typedMsg.length) {
      messageElement.innerText += typedMsg[charIndex];
      charIndex++;
    }
  }
};

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
  if (!detections || detections.length === 0) return false;
  const mouth = detections[0].parts.mouth;
  const topLip = mouth[13];
  const bottomLip = mouth[19];
  const d = dist(topLip._x, topLip._y, bottomLip._x, bottomLip._y);
  return d > 25;
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
  document.getElementById('wish').value = '';
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
