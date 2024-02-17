import { GLContext } from '.';
import { GL } from './GL';
import { Renderer } from './Renderer';
import { State } from './config';
import fragmentShader from './shaders/triangleFragment.glsl';
import vertexShader from './shaders/triangleVertex.glsl';
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

  drawTriangle(data: number[]) {
    invariant(
      data.length === 9,
      'Invalid data length for triangle. Must be 9 floats.'
    );

    this.gl.createProgram(vertexShader, fragmentShader);
    this.gl.createBuffer(new Float32Array(data));
    this.gl.setAttribute('aPosition', 3, this.gl.context.FLOAT, false, 0, 0);
    this.gl.context.drawArrays(this.gl.context.TRIANGLES, 0, 3);
  }
}
