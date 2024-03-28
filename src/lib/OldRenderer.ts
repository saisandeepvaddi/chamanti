import { BufferObject, Camera, getConfig } from '.';
import { RenderObject } from './RenderObject';
import { getGLContext } from './context';
import { Scene } from './scene/Scene';

export class OldRenderer {
  elapsedTime: number = 0;
  prevFrameTime: number = 0;
  renderObjects: Map<string, RenderObject> = new Map();
  rafId: number | null = null;
  scene: Scene | null = null;
  camera: Camera | null = null;
  context = getGLContext();

  addObject(object: BufferObject): RenderObject;
  addObject(object: RenderObject): RenderObject;
  addObject(object: BufferObject | RenderObject): RenderObject {
    if (object instanceof RenderObject) {
      this.renderObjects.set(object.id, object);
      object.setup();
      return object;
    }

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

  setScene(scene: Scene) {
    this.scene = scene;
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  render(_deltaTime: number = 0) {
    this.resizeScreen();
    const [r, g, b, a] = getConfig().clearColor;
    this.context.clearColor(r, g, b, a);
    this.context.clear(
      this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT
    );

    for (const renderObject of this.renderObjects.values()) {
      if (renderObject.hidden) continue;
      renderObject.draw();
    }
  }
}
