import { GLContext } from '.';
import { Renderer } from './Renderer';
import { State } from './config';
import { invariant } from './utils';

export type ChamantiOptions = {
  renderer?: Renderer;
  webglVersion?: 1 | 2;
};

export class Chamanti {
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
        context = canvas.getContext('webgl') as GLContext | null;
        State.webglVersion = 1;
      }
    } else {
      context = canvas.getContext('webgl') as GLContext | null;
      State.webglVersion = 1;
    }

    invariant(!!context, 'No WebGL context available in your browser.');
    const ext = context.getExtension('OES_vertex_array_object');
    if (ext) {
      context.createVertexArray = ext.createVertexArrayOES.bind(ext);
      context.bindVertexArray = ext.bindVertexArrayOES.bind(ext);
      context.deleteVertexArray = ext.deleteVertexArrayOES.bind(ext);
    }
    this.renderer = options.renderer ?? new Renderer(context);
  }
}
