let video;
let faceapi;
let detections = [];
let faceBoxCanvas = null; // 캔버스 상에 매핑된 얼굴 박스
let words = [];
let particles = [];
let baseWords = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 카메라 세팅: 원본 해상도로 캡쳐
  video = createCapture(VIDEO);
  video.hide();

  // ml5 face-api 초기화 (구버전 ml5 사용 가정)
  const faceOptions = {
    withLandmarks: true,
    withExpressions: false,
    withDescriptors: false,
  };
  faceapi = ml5.faceApi(video, faceOptions, modelReady);

  // 텍스트 입력 이벤트
  const inp = document.getElementById('textInput');
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const raw = inp.value.trim();
      baseWords = raw.match(/[A-Za-z]+/g) || [];
      console.log('parsed words:', baseWords);
      if (baseWords.length > 0) initWords();
      inp.value = '';
    }
  });
}

function modelReady() {
  console.log('FaceAPI 모델 로드 완료');
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (!err && result) {
    detections = result;
  }
  faceapi.detect(gotResults);
}

function initWords() {
  words = [];
  for (let i = 0; i < 30; i++) {
    const txt = random(baseWords);
    const y = random(50, height - 50);
    words.push(new Word(txt, random(width, width * 2), y));
  }
}

function draw() {
  background(30);

  // 1) 영상 중앙 크롭 + 캔버스 전체로 그리기
  push();
  translate(width, 0);
  scale(-1, 1);
  tint(100);

  const vw = video.width;
  const vh = video.height;
  const cw = width;
  const ch = height;
  const videoAspect = vw / vh;
  const canvasAspect = cw / ch;
  let sx, sy, sW, sH;

  if (canvasAspect > videoAspect) {
    // 캔버스가 더 넓으면 세로 기준 크롭
    sW = vw;
    sH = vw / canvasAspect;
    sx = 0;
    sy = (vh - sH) / 2;
  } else {
    // 캔버스가 더 좁으면 가로 기준 크롭
    sH = vh;
    sW = vh * canvasAspect;
    sy = 0;
    sx = (vw - sW) / 2;
  }

  // 얼굴 박스 캔버스 좌표로 변환
  if (detections.length > 0) {
    const b = detections[0].alignedRect._box;
    const scaleX = cw / sW;
    const scaleY = ch / sH;
    const xRel = b._x - sx;
    const yRel = b._y - sy;
    const wCan = b._width * scaleX;
    const hCan = b._height * scaleY;
    const xCan = width - (xRel * scaleX + wCan);
    const yCan = yRel * scaleY;
    faceBoxCanvas = { x: xCan, y: yCan, w: wCan, h: hCan };
  } else {
    faceBoxCanvas = null;
  }

  // 크롭된 비디오 그리기
  image(video, 0, 0, cw, ch, sx, sy, sW, sH);
  pop();

  // 2) 단어 & 파티클 업데이트·렌더링
  for (let w of words) {
    w.update();
    w.display();
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Word 클래스: 이동, faceBoxCanvas 충돌 시 페이드아웃+파티클
class Word {
  constructor(txt, x, y) {
    this.txt = txt;
    this.pos = createVector(x, y);
    this.vel = createVector(-2 - random(2), 0);
    this.alpha = 255; // 투명도
    this.fading = false; // 페이드 모드 플래그
  }

  // 단어 초기 상태로 리셋
  reset() {
    this.pos.x = random(width, width * 2);
    this.pos.y = random(50, height - 50);
    this.vel = createVector(-2 - random(2), 0);
    this.alpha = 255;
    this.fading = false;
  }

  update() {
    // 페이드 모드: 투명도 감소 후 완전 사라지면 리셋
    if (this.fading) {
      this.alpha -= 5;
      if (this.alpha <= 0) {
        this.reset();
      }
      return;
    }

    // 평상시 이동
    this.pos.add(this.vel);
    if (this.pos.x < -textWidth(this.txt)) {
      this.reset();
      return;
    }

    // 얼굴 충돌 체크 → 페이드 모드 전환 + 파티클 생성
    if (faceBoxCanvas) {
      const f = faceBoxCanvas;
      if (
        this.pos.x > f.x &&
        this.pos.x < f.x + f.w &&
        this.pos.y > f.y &&
        this.pos.y < f.y + f.h
      ) {
        this.fading = true;
        for (let i = 0; i < 10; i++) {
          particles.push(new Particle(this.pos.x, this.pos.y));
        }
        return;
      }
    }
  }

  display() {
    noStroke();
    fill(255, this.alpha);
    textSize(32);
    text(this.txt, this.pos.x, this.pos.y);
  }
}

// Particle 클래스: 흩어짐 + 페이드아웃
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.lifespan = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 4;
  }

  display() {
    noStroke();
    fill(255, this.lifespan);
    ellipse(this.pos.x, this.pos.y, 8);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}
