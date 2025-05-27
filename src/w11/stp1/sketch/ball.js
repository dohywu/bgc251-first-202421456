class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.vx = -1;
    this.vy = 1;
    this.ax = 0;
    this.ay = 0;
    this.r = r;
  }

  //수정된 collide()
  collide(other, restitution = 0.7) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let minDist = this.r + other.r;
    if (dist <= minDist) {
      let overlap = 0.5 * (minDist - dist);
      let nx = dx / dist;
      let ny = dy / dist;

      this.x -= overlap * nx;
      this.y -= overlap * ny;
      other.x += overlap * nx;
      other.y += overlap * ny;

      let dvx = other.vx - this.vx;
      let dvy = other.vy - this.vy;
      let vn = dvx * nx + dvy * ny;

      if (vn <= 0) {
        const impulse = (-(1 + restitution) * vn) / 2;
        const ix = impulse * nx;
        const iy = impulse * ny;

        this.vx -= ix;
        this.vy -= iy;
        other.vx += ix;
        other.vy += iy;
      }
    }
  }

  applyGravity(ax, ay) {
    this.ax += ax;
    this.ay += ay;
  }

  update() {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
    this.ax = 0;
    this.ay = 0;
  }

  wall() {
    if (this.x < this.r) {
      this.x = this.r;
      this.vx *= -1;
    } else if (this.x > width - this.r) {
      this.x = width - this.r;
      this.vx *= -1;
    }
    if (this.y > height - this.r) {
      this.y = height - this.r;
      this.vy *= -1;
    }
  }

  render() {
    noStroke();
    fill('black');
    circle(this.x, this.y, 2 * this.r);
  }
}
