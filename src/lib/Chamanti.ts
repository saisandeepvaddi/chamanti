import { GLContext } from '.';
import { GL } from './GL';
import { Renderer } from './Renderer';
import { State } from './config';
import { invariant } from './utils';

export type ChamantiOptions = {
  renderer?: Renderer;
  webglVersion?: 1 | 2;
};

export class Chamanti {
  gl: GL;
  renderer: Renderer;
  constructor(
    canvas: HTMLCanvasElement,
    options: ChamantiOptions = {
      renderer: undefined,
      webglVersion: 2,
    }
  ) {
    let context: GLContext | null = null;

    if (options.webglVersion === 2) {
      if (canvas.getContext('webgl2')) {
        context = canvas.getContext('webgl2');
        State.webglVersion = 2;
      } else {
        console.error('WebGL2 not available, falling back to WebGL1');
        context = canvas.getContext('webgl');
        State.webglVersion = 1;
      }
    } else {
      context = canvas.getContext('webgl');
      State.webglVersion = 1;
    }

    invariant(!!context, 'No WebGL context available in your browser.');

    this.gl = new GL(context);
    this.renderer = options.renderer ?? new Renderer(this.gl);
  }
}
