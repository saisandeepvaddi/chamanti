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

    this.render = this.render.bind(this);
  }

  addBufferObject(object: BufferObject) {
    const renderObject = new RenderObject(this.context, object);

    renderObject.setup();

    this.renderObjects.set(renderObject.id, renderObject);
    return renderObject;
  }

  resizeScreen() {
    let displayWidth = 0;
    let displayHeight = 0;

    if (this.context.canvas instanceof HTMLCanvasElement) {
      displayWidth = this.context.canvas.clientWidth;
      displayHeight = this.context.canvas.clientHeight;
    } else if (this.context.canvas instanceof OffscreenCanvas) {
      displayWidth = this.context.canvas.width;
      displayHeight = this.context.canvas.height;
    }

    let shouldResize = false;
    if (
      this.context.canvas.width !== displayWidth ||
      this.context.canvas.height !== displayHeight
    ) {
      this.context.canvas.width = displayWidth;
      this.context.canvas.height = displayHeight;
      shouldResize = true;
    }

    if (shouldResize) {
      this.context.viewport(0, 0, displayWidth, displayHeight);
    }
  }

  render(_deltaTime: number = 0) {
    this.resizeScreen();
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.context.clear(
      this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT
    );

    for (const renderObject of this.renderObjects.values()) {
      renderObject.draw();
    }
  }
}
