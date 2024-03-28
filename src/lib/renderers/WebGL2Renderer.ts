import { Camera, invariant } from '..';
import { Scene } from '../scene/Scene';
import { GlobalState } from '../state/global';
import { Renderer } from './Renderer';

export class WebGL2Renderer implements Renderer {
  gl: WebGL2RenderingContext;
  scene: Scene | null = null;
  camera: Camera | null = null;
  constructor(canvas: HTMLCanvasElement) {
    console.log('WebGL2Renderer created.');
    const context = canvas.getContext('webgl2');
    invariant(!!context, 'WebGL2 not available in your browser.');
    this.gl = context;
    GlobalState.gl = this.gl;
  }
  resizeScreen() {
    let displayWidth = 0;
    let displayHeight = 0;

    if (this.gl.canvas instanceof HTMLCanvasElement) {
      displayWidth = this.gl.canvas.clientWidth;
      displayHeight = this.gl.canvas.clientHeight;
    } else if (this.gl.canvas instanceof OffscreenCanvas) {
      displayWidth = this.gl.canvas.width;
      displayHeight = this.gl.canvas.height;
    }

    let shouldResize = false;
    if (
      this.gl.canvas.width !== displayWidth ||
      this.gl.canvas.height !== displayHeight
    ) {
      this.gl.canvas.width = displayWidth;
      this.gl.canvas.height = displayHeight;
      shouldResize = true;
    }

    if (shouldResize) {
      this.gl.viewport(0, 0, displayWidth, displayHeight);
    }
  }
  setScene(scene: Scene) {
    this.scene = scene;
    this.scene.setContext(this.gl);
  }
  setCamera(camera: Camera) {
    this.camera = camera;
  }

  render(): void {
    console.log('Rendering scene with WebGL2Renderer.');
    this.resizeScreen();
    const [r, g, b, a] = [1.0, 0.5, 0.0, 1.0];
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    invariant(!!this.scene, 'No scene set.');
    invariant(!!this.camera, 'No camera set.');
    for (const child of this.scene.children) {
      child.render(this.camera);
    }
  }
}
