//stp1
let video;

function setup() {
  createCanvas(800, 600);
  video = createCapture(video, { flipped: true });
  video.hide(true);
  video.size(64, 48);
  console.log(video);
}

function draw() {
  // background(220);

  let aspectRatioCanvus = width / height;
  let aspectRatioVideo = video.width / video.height;
  let newWidth;
  let newHeight;
  let zeroX, zeroY;
  if (aspectRatioCanvus > aspectRatioVideo) {
    newWidth = width;
    newHeight = newWidth / aspectRatioVideo;
  } else {
    newHeight = height;
    newWidth = newHeight * aspectRatioVideo;
  }
  zeroX = (width - newWidth) / 2;
  zeroY = (height - newHeight) / 2;
  image(video, zeroX, zeroY, newWidth, newHeight);
  fill('red');
  circle(mouseX, mouseY, 50);
}
