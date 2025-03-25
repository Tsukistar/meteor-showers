import { Meteor } from "./meteor";

interface MeteorShowerOptions {
  color?: string;
  density?: number;
  duration?: number;
  direction?: number;
}

export class MeteorShower {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private meteors: Meteor[] = [];
  private options: Required<MeteorShowerOptions>;
  private animationFrameId: number | null = null;

  constructor(options: MeteorShowerOptions = {}) {
    this.options = {
      color: options.color ?? "#ffffff",
      density: options.density ?? 2,
      duration: options.duration ?? 1000,
      direction: options.direction ?? 45,
    };

    this.canvas = document.createElement("canvas");
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "9999";
    this.resizeCanvas();
    document.body.appendChild(this.canvas);

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.ctx = context;
    this.start();

    window.addEventListener("resize", () => this.resizeCanvas());
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (Math.random() < this.options.density / 60) {
      this.meteors.push(
        new Meteor(this.ctx, this.canvas.width, this.canvas.height, {
          color: this.options.color,
          duration: this.options.duration,
          direction: this.options.direction,
        })
      );
    }

    this.meteors = this.meteors.filter((meteor) => meteor.draw());
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  public start() {
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  public destroy() {
    this.stop();
    this.canvas.remove();
    window.removeEventListener("resize", () => this.resizeCanvas());
  }
}

export default MeteorShower;
