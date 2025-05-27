import { createParticles, updateParticles } from './particleEngine.js';
import { getColorByEmotion } from './colorScheme.js';

let hasGenerated = false;

export function generateDream(params) {
  const baseColor = getColorByEmotion(params.emotion);
  createParticles({
    count: 100,
    color: baseColor,
    motion: params.motion,
    energy: params.sound.energy,
  });

  updateParticles();
}
