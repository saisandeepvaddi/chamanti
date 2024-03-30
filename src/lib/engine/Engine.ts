import { CameraControls } from '..';
import { WebGL2Renderer } from '../renderers/WebGL2Renderer';
import { GlobalState, _initGlobalState, getGlobalState } from '../state/global';

export class Engine {
  renderer: WebGL2Renderer;
  isRunning: boolean = false;
  state: GlobalState;
  controls: CameraControls | null = null;
  constructor(canvas: HTMLCanvasElement) {
    _initGlobalState(canvas);
    this.renderer = new WebGL2Renderer();
    this.state = getGlobalState();
    this.controls = new CameraControls(this.state.camera, this.state.canvas);
    this.startRenderLoop = this.startRenderLoop.bind(this);
  }
  start() {
    this.isRunning = true;
    this.startRenderLoop();
  }

  startRenderLoop() {
    this.controls?.updateCameraPosition();
    this.renderer.render();
    requestAnimationFrame(this.startRenderLoop);
  }

  getActiveScene() {
    return this.state.scene;
  }
}
