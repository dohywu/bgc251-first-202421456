import {
  initEmotionModel,
  getCurrentEmotion,
} from './inputHandlers/emotionInput.js';
import { startMicInput, getSoundMood } from './inputHandlers/audioInput.js';
import { getMotionValue } from './inputHandlers/pointerInput.js';
import { generateDream } from './engine/dreamGenerator.js';
import { displayOverlay, hideOverlay } from './ui/overlay.js';
import { saveCurrentDream } from './ui/saveMemory.js';

let dreamParams = {};

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  displayOverlay('Your emotions create dreams.');

  initEmotionModel();
  startMicInput();

  setTimeout(() => {
    hideOverlay();
  }, 4000);
}

function draw() {
  background(0, 10);

  const emotion = getCurrentEmotion();
  const sound = getSoundMood();
  const motion = getMotionValue();

  dreamParams = { emotion, sound, motion };
  generateDream(dreamParams);

  console.log('emotion:', emotion);
  console.log('sound:', sound);
  console.log('motion:', motion);
}

function keyPressed() {
  if (key === 's') {
    saveCurrentDream();
  }
}

window.setup = setup;
window.draw = draw;
window.preload = preload;
window.keyPressed = keyPressed;
