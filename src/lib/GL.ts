import { Program } from './Program';
import { State } from './config';
import { GLContext } from './types';
import { invariant } from './utils';

export class GL {
  context: GLContext;
  private program: Program | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  constructor(context: GLContext) {
    this.context = context;
  }

  createProgram(vertexSource: string, fragmentSource: string) {
    this.program = new Program(this.context, vertexSource, fragmentSource);
    invariant(!!this.program, 'WebGL createProgram failed');
    return this.program;
  }

  useProgram() {
    invariant(
      !!this.program,
      'No program created... call createProgram with shaders.'
    );
    this.program.use();
  }

  createBuffer(data: Float32Array) {
    if (State.webglVersion === 2) {
      const vao =
        this.vao ??
        (this.context as WebGL2RenderingContext).createVertexArray();
      invariant(!!vao, 'Error creating vertex array object');
      (this.context as WebGL2RenderingContext).bindVertexArray(vao);
      this.vao = vao;
      (this.context as WebGL2RenderingContext).bindVertexArray(vao);
    }

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
    type: number = this.context.FLOAT,
    normalized = false,
    stride = 0,
    offset = 0
  ) {
    invariant(
      !!this.program,
      'Error setting attributes. No program created... call createProgram with shaders.'
    );
    const location = this.program.getAttributeLocation(attribute);
    invariant(location !== -1, `No attribute found with name ${attribute}`);

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
    const location = this.program.getUniformLocation(uniform);
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
