export function getColorByEmotion(emotion) {
  if (!emotion) return [255, 255, 255];

  const weights = {
    happy: [255, 204, 100],
    sad: [100, 150, 255],
    angry: [255, 80, 80],
    surprised: [255, 255, 150],
    neutral: [180, 180, 200],
  };

  let r = 0,
    g = 0,
    b = 0;
  let total = 0;

  for (let key in emotion) {
    if (weights[key]) {
      r += emotion[key] * weights[key][0];
      g += emotion[key] * weights[key][1];
      b += emotion[key] * weights[key][2];
      total += emotion[key];
    }
  }

  if (total === 0) return [200, 200, 200];

  return [r / total, g / total, b / total];
}
