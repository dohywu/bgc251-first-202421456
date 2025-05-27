let particles = [];

export function createParticles({ count, color, motion, energy }) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1) * motion * 2,
      vy: random(-1, 1) * motion * 2,
      size: random(5, 15) * energy,
      color: color,
    });
  }
}

export function updateParticles() {
  noStroke();
  particles.forEach((p) => {
    fill(p.color[0], p.color[1], p.color[2], 100);
    ellipse(p.x, p.y, p.size);
    p.x += p.vx;
    p.y += p.vy;

    if (p.x > width) p.x = 0;
    if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    if (p.y < 0) p.y = height;
  });
}
