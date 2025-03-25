export class Meteor {
  private x: number;
  private y: number;
  private length: number;
  private speed: number;
  private angle: number;
  private ctx: CanvasRenderingContext2D;
  private color: string;
  private duration: number;
  private startTime: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    options: {
      color: string;
      duration: number;
      direction: number;
    }
  ) {
    this.ctx = ctx;
    this.color = options.color;
    this.duration = options.duration;
    this.angle = (options.direction * Math.PI) / 180;
    this.speed = Math.random() * 5 + 2;
    this.length = Math.random() * 20 + 10;
    this.startTime = Date.now();

    this.x = Math.random() * width;
    this.y = Math.random() * height;
  }

  draw(): boolean {
    const elapsed = Date.now() - this.startTime;
    if (elapsed > this.duration) return false;

    const alpha = 1 - elapsed / this.duration;

    this.ctx.beginPath();
    this.ctx.strokeStyle = `${this.color}${Math.floor(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
    this.ctx.lineWidth = 1;

    const dx = Math.cos(this.angle) * this.length;
    const dy = Math.sin(this.angle) * this.length;

    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x + dx, this.y + dy);
    this.ctx.stroke();

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    return true;
  }
}
