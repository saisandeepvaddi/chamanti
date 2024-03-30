import { Camera, invariant } from '..';
import { Scene } from '../scene/Scene';

export interface GlobalState {
  isInitialized: boolean;
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  camera: Camera;
  scene: Scene;
}

class GlobalStateImpl implements GlobalState {
  isInitialized: boolean = false;
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  camera: Camera;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('webgl2');
    invariant(!!context, 'WebGL2 context not found.');
    this.gl = context;
    this.isInitialized = true;
    this.camera = new Camera(45, canvas.width / canvas.height, 0.1, 100);
    this.scene = new Scene();
  }
}

let globalStateInstance: GlobalState | null = null;

export const _initGlobalState = (canvas: HTMLCanvasElement) => {
  invariant(!globalStateInstance, 'Global state already initialized.');
  globalStateInstance = new GlobalStateImpl(canvas);
};

export const getGlobalState = (): GlobalState => {
  invariant(!!globalStateInstance, 'Global state not initialized.');
  return globalStateInstance;
};

export const updateState = (state: Partial<GlobalState>) => {
  invariant(!!globalStateInstance, 'Global state not initialized.');
  globalStateInstance = { ...globalStateInstance, ...state };
};

export const updateStateProp = <T extends keyof GlobalState>(
  prop: T,
  value: GlobalState[T]
) => {
  invariant(!!globalStateInstance, 'Global state not initialized.');
  globalStateInstance[prop] = value;
};
