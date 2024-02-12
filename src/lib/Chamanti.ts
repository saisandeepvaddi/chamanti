import { Attribute, Uniform } from '.';
import { GL } from './GL';
import fragmentShader from './shaders/triangleFragment.glsl';
import vertexShader from './shaders/triangleVertex.glsl';
import { invariant } from './utils';

export class Chamanti {
  gl: GL;
  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    invariant(!!context, 'No WebGL available');

    this.gl = new GL(context);
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

  drawBuffer(options: {
    vertexShader: string;
    fragmentShader: string;
    attributes?: Attribute[];
    uniforms?: Uniform[];
  }) {
    const {
      attributes = [],
      uniforms = [],
      vertexShader,
      fragmentShader,
    } = options;
    this.gl.createProgram(vertexShader, fragmentShader);
    attributes.forEach(
      ({ name, size, type, normalized, stride, data, offset }) => {
        const buffer = this.gl.createBuffer(new Float32Array(data));
        this.gl.bindBuffer(buffer);
        this.gl.setAttribute(name, size, type, normalized, stride, offset);
        this.gl.context.drawArrays(
          this.gl.context.TRIANGLES,
          0,
          data.length / size
        );
      }
    );
    uniforms.forEach(({ name, value }) => {
      this.gl.setUniform(name, value);
    });
  }
}
