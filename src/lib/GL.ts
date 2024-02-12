import { GLContext } from './types';
import { invariant } from './utils';

export class GL {
  context: GLContext;
  private program: WebGLProgram | null = null;
  constructor(context: GLContext) {
    this.context = context;
  }

  shader(source: string, type: number) {
    const shader = this.context.createShader(type);
    invariant(!!shader, 'createShader failed');

    this.context.shaderSource(shader, source);
    this.context.compileShader(shader);
    if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
      throw new Error(
        `Error compiling shader: ${this.context.getShaderInfoLog(shader)}`
      );
    }
    return shader;
  }

  createProgram(vertexSource: string, fragmentSource: string) {
    const vertexShader = this.shader(vertexSource, this.context.VERTEX_SHADER);
    const fragmentShader = this.shader(
      fragmentSource,
      this.context.FRAGMENT_SHADER
    );

    this.program = this.context.createProgram();
    invariant(!!this.program, 'WebGL createProgram failed');

    this.context.attachShader(this.program, vertexShader);
    this.context.attachShader(this.program, fragmentShader);
    this.context.linkProgram(this.program);

    if (
      !this.context.getProgramParameter(this.program, this.context.LINK_STATUS)
    ) {
      throw new Error(
        `Error linking webgl program: ${this.context.getProgramInfoLog(this.program)}`
      );
    }

    this.context.useProgram(this.program);

    return this.program;
  }

  createBuffer(data: Float32Array) {
    const buffer = this.context.createBuffer();
    invariant(!!buffer, 'Error binding buffers. WebGL createBuffer failed');

    this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
    this.context.bufferData(
      this.context.ARRAY_BUFFER,
      data,
      this.context.STATIC_DRAW
    );

    return buffer;
  }
  bindBuffer(buffer: WebGLBuffer) {
    this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
  }
  setAttribute(
    attribute: string,
    size: number,
    type = this.context.FLOAT,
    normalized = false,
    stride = 0,
    offset = 0
  ) {
    invariant(
      !!this.program,
      'Error setting attributes. No program created... call createProgram with shaders.'
    );
    const location = this.context.getAttribLocation(this.program, attribute);
    this.context.vertexAttribPointer(
      location,
      size,
      type,
      normalized,
      stride,
      offset
    );
    this.context.enableVertexAttribArray(location);
  }
  setUniform(
    uniform: string,
    value: number | boolean | number[] | Float32Array
  ) {
    invariant(
      !!this.program,
      'Error setting uniforms. No program created... call createProgram with shaders.'
    );
    const location = this.context.getUniformLocation(this.program, uniform);
    invariant(!!location, `No uniform found with name ${uniform}`);
    switch (typeof value) {
      case 'number':
        this.context.uniform1f(location, value);
        break;
      case 'boolean':
        this.context.uniform1i(location, value ? 1 : 0);
        break;
      case 'object':
        if (value instanceof Float32Array) {
          switch (value.length) {
            case 1:
              this.context.uniform1fv(location, value);
              break;
            case 2:
              this.context.uniform2fv(location, value);
              break;
            case 3:
              this.context.uniform3fv(location, value);
              break;
            case 4:
              this.context.uniform4fv(location, value);
              break;
            default:
              throw new Error('Invalid uniform value');
          }
        }
    }
  }
}
