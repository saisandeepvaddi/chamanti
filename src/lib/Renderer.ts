import { BufferObject, GL, GLContext } from './';
import { RenderObject } from './RenderObject';

export class Renderer {
  gl: GL;
  elapsedTime: number = 0;
  prevFrameTime: number = 0;
  renderObjects: Map<string, RenderObject> = new Map();
  rafId: number | null = null;
  context: GLContext;
  constructor(gl: GL, context: GLContext) {
    this.gl = gl;
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
    const renderObject = new RenderObject(this.gl, this.context, object);
    this.renderObjects.set(renderObject.id, renderObject);

    renderObject.setupBuffers();

    return renderObject;
  }

  render(deltaTime: number = 0) {
    this.gl.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.context.clear(
      this.gl.context.COLOR_BUFFER_BIT | this.gl.context.DEPTH_BUFFER_BIT
    );

    for (const renderObject of this.renderObjects.values()) {
      renderObject.program.use();
      renderObject.updateBuffers();
      renderObject.draw();
    }
  }
}
