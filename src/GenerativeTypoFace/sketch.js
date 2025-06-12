let video;
let faceapi;
let detections = [];
let baseWords = [];
let words = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  faceapi = ml5.faceApi(video, { withLandmarks: true }, () => {
    faceapi.detect(gotResults);
  });

  let inputBox = document.getElementById('textInput');

  //영문,공백만 허용
  inputBox.addEventListener('input', function () {
    inputBox.value = inputBox.value.replace(/[^A-Za-z\s]/g, '');
  });

  //엔터 누르면 단어 움직이기 시작
  inputBox.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      let text = inputBox.value.trim();
      let wordList = text.match(/[A-Za-z]+/g);
      if (wordList) {
        baseWords = wordList;
        initWords();
      }
      inputBox.value = '';
    }
  });

  textAlign(LEFT, TOP);
  textSize(32);
  fill(255);
}

//얼굴 인식 결과 처리
function gotResults(err, result) {
  if (!err) {
    detections = result;
  }
  faceapi.detect(gotResults);
}

//words 즉 w에 들어갈 리스트틀
function initWords() {
  words = [];
  for (let i = 0; i < 30; i++) {
    words.push({
      text: random(baseWords),
      x: random(width, width * 2),
      y: random(50, height - 50),
      speed: random(2, 4),
      alpha: 255,
      fading: false,
    });
  }
}

function draw() {
  background(30);
  tint(100);

  // 비디오를 중앙에 맞춰 그리기
  let CanvasWH = width / height;
  let VideoWH = video.width / video.height;
  let newW, newH;
  if (CanvasWH > VideoWH) {
    newW = width;
    newH = newW / VideoWH;
  } else {
    newH = height;
    newW = newH * VideoWH;
  }
  let x0 = (width - newW) / 2;
  let y0 = (height - newH) / 2;
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, x0, y0, newW, newH);
  pop();

  // 얼굴 박스
  let boxX, boxY, boxW, boxH;
  if (detections.length > 0) {
    let box = detections[0].alignedRect.box;
    let scaleX = newW / video.width;
    let scaleY = newH / video.height;
    let bx = box.x * scaleX;
    let by = box.y * scaleY;
    boxW = box.width * scaleX;
    boxH = box.height * scaleY;
    boxX = x0 + newW - (bx + boxW); // 좌우 반전된 x 좌표
    boxY = y0 + by;

    noFill();
    stroke(255, 0, 0);
    rect(boxX, boxY, boxW, boxH);
    noStroke();
  }
  // 단어 업데이트 & 렌더링
  for (let i = words.length - 1; i >= 0; i--) {
    let w = words[i];
    // 페이드 모드
    if (w.fading) {
      w.alpha -= 5;
      if (w.alpha <= 0) {
        words.splice(i, 1);
        continue;
      }
    } else {
      w.x -= w.speed;
    }
    fill(255, w.alpha);
    text(w.text, w.x, w.y);
    // 화면 밖으로 벗어나면 제거
    if (w.x < 0) {
      words.splice(i, 1);
      continue;
    }
    // 얼굴 충돌 시 페이드 & 파티클 생성
    let inFaceBox =
      detections.length > 0 &&
      w.x > boxX &&
      w.x < boxX + boxW &&
      w.y > boxY &&
      w.y < boxY + boxH;
    if (!w.fading && inFaceBox) {
      w.fading = true;
      for (let j = 0; j < 5; j++) {
        particles.push({
          x: w.x,
          y: w.y,
          vx: random(-3, 3),
          vy: random(-3, 3),
          life: 255,
        });
      }
    }
  }
  // 파티클 업데이트 & 렌더링
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 5;
    fill(255, p.life);
    noStroke();
    ellipse(p.x, p.y, 8);
    if (p.life <= 0) particles.splice(i, 1);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
