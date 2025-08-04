let img;
let uploaded = false;

function setup() {
  createCanvas(600, 400);
  background(220);
  textAlign(CENTER, CENTER);
  text('이미지를 업로드 해주세요', width / 2, height / 2);

  let input = createFileInput(handleFile);
  input.position(10, 10);
}

function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      resizeCanvas(img.width, img.height);
      image(img, 0, 0);
      uploaded = true;
      glitchImage();
    });
  }
}

function glitchImage() {
  if (!uploaded) return;

  for (let i = 0; i < 25; i++) {
    // ✅ 블록 개수 줄이기 → 더 명확한 단계
    let blockW = int(random(width * 0.4, width * 0.8)); // ✅ 가로 크게
    let blockH = int(random(30, 80)); // ✅ 세로 두껍게 → 단계 확실
    let x = int(random(width - blockW));
    let y = int(random(height - blockH));

    let piece = img.get(x, y, blockW, blockH);

    let offsetX = int(random(-120, 120)); // ✅ 크게 밀어서 확실한 Distort
    let offsetY = int(random(-20, 20)); // ✅ 세로도 살짝 흔들림
    image(piece, x + offsetX, y + offsetY);
  }
}
