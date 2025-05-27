let lastX = 0;
let lastY = 0;
let motionStrength = 0;

window.addEventListener('mousemove', (e) => {
  let dx = e.movementX;
  let dy = e.movementY;
  let dist = Math.sqrt(dx * dx + dy * dy);
  motionStrength = lerp(motionStrength, dist / 10, 0.2);
});

export function getMotionValue() {
  return motionStrength;
}
