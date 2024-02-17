import { GLContext, invariant } from '.';

export class Program {
  context: GLContext;
  private _program: WebGLProgram;
  private _vertexShader: WebGLShader;
  private _fragmentShader: WebGLShader;
  private attributes: Map<string, GLint> = new Map();
  private uniforms: Map<string, WebGLUniformLocation> = new Map();

  constructor(
    context: GLContext,
    vertexSource: string,
    fragmentSource: string
  ) {
    this.context = context;
    this._vertexShader = this.shader(vertexSource, this.context.VERTEX_SHADER);
    this._fragmentShader = this.shader(
      fragmentSource,
      this.context.FRAGMENT_SHADER
    );
    this._program = this.create();
  }

  private shader(source: string, type: number) {
    const shader = this.context.createShader(type);
    invariant(!!shader, `createShader ${type} failed`);

    this.context.shaderSource(shader, source);
    this.context.compileShader(shader);
    if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
      this.context.deleteShader(shader);
      throw new Error(
        `Error compiling ${type} shader: ${this.context.getShaderInfoLog(shader)}`
      );
    }
    return shader;
  }

  private create() {
    invariant(!!this._vertexShader, 'Invalid Vertex Shader');
    invariant(!!this._fragmentShader, 'Invalid Fragment Shader');

    const program = this.context.createProgram();

    invariant(!!program, 'WebGL createProgram failed');

    this.context.attachShader(program, this._vertexShader);
    this.context.attachShader(program, this._fragmentShader);
    this.context.linkProgram(program);

    if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
      throw new Error(
        `Error linking webgl program: ${this.context.getProgramInfoLog(this._program)}`
      );
    }

    return program;
  }

  use() {
    invariant(
      !!this._program,
      'Error using program. No program created... call createProgram with shaders.'
    );
    this.context.useProgram(this._program);
  }

  getAttributeLocation(attribute: string): number {
    invariant(
      !!this._program,
      'Error setting attributes. No program created... call createProgram with shaders.'
    );
    const location =
      this.attributes.get(attribute) ??
      this.context.getAttribLocation(this._program, attribute);

    if (!this.attributes.has(attribute)) {
      this.attributes.set(attribute, location);
    }

    return location;
  }

  getUniformLocation(uniform: string): WebGLUniformLocation {
    invariant(
      !!this._program,
      'Error setting uniforms. No program created... call createProgram with shaders.'
    );

    const location =
      this.uniforms.get(uniform) ??
      this.context.getUniformLocation(this._program, uniform);

    invariant(!!location, `No uniform found with name ${uniform}`);

    if (!this.uniforms.has(uniform)) {
      this.uniforms.set(uniform, location);
    }

    return location;
  }
}
