import { Camera, invariant } from '..';
import { Scene } from '../scene/Scene';
import { getGlobalState } from '../state/global';
import { Renderer } from './Renderer';

export class WebGL2Renderer implements Renderer {
  scene: Scene | null = null;
  camera: Camera | null = null;
  gl: WebGL2RenderingContext;
  constructor() {
    console.log('WebGL2Renderer created.');
    const globalState = getGlobalState();
    this.gl = globalState.gl;
    this.scene = globalState.scene;
    this.camera = globalState.camera;
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

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  render(): void {
    this.resizeScreen();
    const [r, g, b, a] = [0.0, 0.0, 0.0, 1.0];
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    invariant(!!this.scene, 'No scene set.');
    invariant(!!this.camera, 'No camera set.');
    for (const child of this.scene.children) {
      child.render(this.camera);
    }
  }
}
