let video;
let faceapi;
let detections = [];

let flameOn = false;
let hasBlown = false;

let messageDiv;
let inputBox;
let startBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 카메라 켜기
  video = createCapture(VIDEO);
  video.size(240, 180);
  video.hide();

  // 얼굴 인식 설정
  const options = {
    withLandmarks: true,
    withDescriptors: false,
    withExpressions: false,
  };
  faceapi = ml5.faceApi(video, options, () => {
    faceapi.detect(gotFace);
  });

  // HTML 요소 가져오기
  messageDiv = select('#message');
  inputBox = select('#wish');
  startBtn = select('#start-button');
  startBtn.mousePressed(startCandle);
}

function gotFace(err, result) {
  if (result) {
    detections = result;
  }
  setTimeout(() => faceapi.detect(gotFace), 150);
}

function draw() {
  background('#fff2f2');

  // 영상 표시 (반전)
  push();
  translate(width / 2 + 120, 100);
  scale(-1, 1);
  image(video, 0, 0, 240, 180);
  pop();

  // 촛불 그리기
  drawCandle(width / 2, height / 2);

  // 입 벌리면 불 꺼짐
  if (flameOn && mouthOpen()) {
    flameOn = false;
    hasBlown = true;
    messageDiv.html(`"${inputBox.value()}" 소원이 이루어지길! 🎉`);
  }
}

function drawCandle(x, y) {
  // 양초 몸통
  fill('#FFDDAA');
  noStroke();
  rect(x - 15, y, 30, 80, 10);

  // 심지
  fill(50);
  rect(x - 2, y - 40, 4, 40);

  // 불꽃
  if (flameOn) {
    fill(255, 150, 0);
    ellipse(x, y - 50 + random(-2, 2), 20, 30);
  }
}

function mouthOpen() {
  if (detections.length === 0) return false;
  let m = detections[0].parts.mouth;
  let topLip = m[13];
  let bottomLip = m[19];
  let d = dist(topLip._x, topLip._y, bottomLip._x, bottomLip._y);
  return d > 8;
}

function startCandle() {
  flameOn = true;
  hasBlown = false;
  messageDiv.html('');
}
