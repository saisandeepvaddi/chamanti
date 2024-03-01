import { Config, GLContext } from '.';
import { Renderer } from './Renderer';
import { invariant } from './utils';

export type ChamantiOptions = {
  renderer?: Renderer;
  webglVersion?: 1 | 2;
};

export class Chamanti {
  renderer: Renderer;
  context: GLContext;
  constructor(
    canvas: HTMLCanvasElement,
    options: ChamantiOptions = {
      renderer: undefined,
      webglVersion: 2,
    }
  ) {
    if (options.webglVersion === 2) {
      if (canvas.getContext('webgl2')) {
        this.context = canvas.getContext('webgl2', {
          alpha: true,
        }) as GLContext;
        Config.webglVersion = 2;
      } else {
        console.error('WebGL2 not available, falling back to WebGL1');
        this.context = canvas.getContext('webgl', {
          alpha: true,
        }) as GLContext;
        Config.webglVersion = 1;
      }
    } else {
      this.context = canvas.getContext('webgl', {
        alpha: true,
      }) as GLContext;
      Config.webglVersion = 1;
    }

    invariant(!!this.context, 'No WebGL context available in your browser.');
    const ext = this.context.getExtension('OES_vertex_array_object');
    if (ext) {
      this.context.createVertexArray = ext.createVertexArrayOES.bind(ext);
      this.context.bindVertexArray = ext.bindVertexArrayOES.bind(ext);
      this.context.deleteVertexArray = ext.deleteVertexArrayOES.bind(ext);
    }
    this.context.enable(this.context.DEPTH_TEST);
    this.context.cullFace(this.context.BACK);
    this.context.depthFunc(this.context.LEQUAL);
    this.renderer = options.renderer ?? new Renderer(this.context);
  }
}
