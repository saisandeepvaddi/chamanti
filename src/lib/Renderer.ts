import { BufferObject, GLContext } from './';
import { RenderObject } from './RenderObject';

export class Renderer {
  elapsedTime: number = 0;
  prevFrameTime: number = 0;
  renderObjects: Map<string, RenderObject> = new Map();
  rafId: number | null = null;
  context: GLContext;
  constructor(context: GLContext) {
    this.context = context;

    this.startRenderLoop = this.startRenderLoop.bind(this);
    this.render = this.render.bind(this);
  }
  startRenderLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    const animate = (time: number) => {
      const deltaTime = time - this.prevFrameTime;
      this.prevFrameTime = time;
      this.elapsedTime += deltaTime;
      this.render(deltaTime);
      this.rafId = requestAnimationFrame(animate);
    };
    this.rafId = requestAnimationFrame(animate);
  }

  addBufferObject(object: BufferObject) {
    const renderObject = new RenderObject(this.context, object);
    this.renderObjects.set(renderObject.id, renderObject);

    renderObject.setup();

    return renderObject;
  }

  render(_deltaTime: number = 0) {
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.context.clear(
      this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT
    );

    for (const renderObject of this.renderObjects.values()) {
      renderObject.program.use();
      renderObject.update();
      renderObject.draw();
    }
  }
}
