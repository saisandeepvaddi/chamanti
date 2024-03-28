import { Camera, invariant } from '..';

export class GlobalState {
  static instance: GlobalState;
  static getInstance() {
    if (!GlobalState.instance) {
      GlobalState.instance = new GlobalState();
    }
    return GlobalState.instance;
  }
  private constructor() {}
  static gl: WebGL2RenderingContext | null = null;
  static camera: Camera | null = null;
  static getGLContext() {
    invariant(!!this.gl, 'GL context not set.');
    return this.gl;
  }
}
