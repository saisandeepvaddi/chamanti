import { CameraControls } from '..';
import { Renderer } from '../renderers/Renderer';
import { GlobalState, _initGlobalState, getGlobalState } from '../state/global';

export class Engine {
  renderer: Renderer;
  isRunning: boolean = false;
  state: GlobalState;
  controls: CameraControls | null = null;
  lastFrameTime: number = performance.now();
  constructor(canvas: HTMLCanvasElement) {
    _initGlobalState(canvas);
    this.renderer = new Renderer();
    this.state = getGlobalState();
    this.controls = new CameraControls(this.state.camera, this.state.canvas);
    this.startRenderLoop = this.startRenderLoop.bind(this);
  }
  start() {
    this.isRunning = true;
    requestAnimationFrame(this.startRenderLoop);
  }

  renderOnce() {
    this.controls?.updateCameraPosition();
    this.renderer.render(this.lastFrameTime);
  }

  startRenderLoop(time: number) {
    this.controls?.updateCameraPosition();
    const delta = time - this.lastFrameTime;
    this.lastFrameTime = time;
    this.renderer.render(delta);
    requestAnimationFrame(this.startRenderLoop);
  }

  getActiveScene() {
    return this.state.scene;
  }
}
