class Particle {
  constructor(x, y, r, colour, angleDeg, speed) {
    this.x = x;
    this.y = y;
    this.vx = cos(radians(angleDeg)) * speed;
    this.vy = sin(radians(angleDeg)) * speed;
    this.r = r;
    this.colour = colour;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  bounding() {
    if (this.x < this.r || this.x > width - this.r) {
      this.vx *= -1;
      this.x = constrain(this.x, this.r, width - this.r);
    }
    if (this.y < this.r || this.y > height - this.r) {
      this.vy *= -1;
      this.y = constrain(this.y, this.r, height - this.r);
    }
  }

  render() {
    noStroke();
    fill(this.colour);
    circle(this.x, this.y, 2 * this.r);
  }
}
