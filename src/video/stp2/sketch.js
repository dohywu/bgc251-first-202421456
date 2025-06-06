let video;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}

function draw() {
  background(0);
  video.loadPixels();

  for (let i = 0; i < video.pixels.length / 4; i++) {
    let idx = i * 4;
    let r = video.pixels[idx];
    let g = video.pixels[idx + 1];
    let b = video.pixels[idx + 2];
    let a = video.pixels[idx + 3];

    // 예시: 밝은 픽셀 로그 출력
    if ((r + g + b) / 3 > 200) {
      console.log(
        `Bright pixel at index ${idx / 4}: R:${r} G:${g} B:${b} A:${a}`
      );
    }
  }

  image(video, 0, 0, width, height);
  fill('red');
  circle(mouseX, mouseY, 50);
}
