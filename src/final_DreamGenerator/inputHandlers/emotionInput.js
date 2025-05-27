let faceapi;
let detections = [];
let currentEmotion = { happy: 0, sad: 0, angry: 0, neutral: 1 };
let video;

export function initEmotionModel() {
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  const detectionOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: false,
  };

  faceapi = ml5.faceApi(video, detectionOptions, () => {
    console.log('FaceAPI ready');
    getEmotion();
  });
}

function getEmotion() {
  faceapi.detect((err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    if (result && result.length > 0 && result[0].expressions) {
      detections = result;
      currentEmotion = result[0].expressions;
    }
    setTimeout(getEmotion, 200);
  });
}

export function getCurrentEmotion() {
  if (!currentEmotion || Object.keys(currentEmotion).length === 0) {
    return { neutral: 1 }; // 기본값 설정
  }
  return currentEmotion;
}
