import { GLContext, invariant } from '.';

export class Program {
  context: GLContext;
  program: WebGLProgram;
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  attributes: Map<string, GLint> = new Map();
  uniforms: Map<string, WebGLUniformLocation | null> = new Map();

  constructor(
    context: GLContext,
    vertexSource: string,
    fragmentSource: string
  ) {
    this.context = context;
    this.vertexShader = this.shader(vertexSource, this.context.VERTEX_SHADER);
    this.fragmentShader = this.shader(
      fragmentSource,
      this.context.FRAGMENT_SHADER
    );
    this.program = this.create();
  }

  private shader(source: string, type: number) {
    const shader = this.context.createShader(type);
    invariant(!!shader, `createShader ${type} failed`);

    this.context.shaderSource(shader, source);
    this.context.compileShader(shader);
    if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
      const shaderType =
        type === this.context.VERTEX_SHADER ? 'vertex' : 'fragment';
      const shaderLog = this.context.getShaderInfoLog(shader);
      this.context.deleteShader(shader);
      throw new Error(`Error compiling ${shaderType} shader:\n${shaderLog}`);
    }
    return shader;
  }

  private create() {
    invariant(!!this.vertexShader, 'Invalid Vertex Shader');
    invariant(!!this.fragmentShader, 'Invalid Fragment Shader');

    const program = this.context.createProgram();

    invariant(!!program, 'WebGL createProgram failed');

    this.context.attachShader(program, this.vertexShader);
    this.context.attachShader(program, this.fragmentShader);
    this.context.linkProgram(program);

    if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
      const log = this.context.getProgramInfoLog(this.program);
      throw new Error(`Error linking webgl program: ${log}`);
    }

    return program;
  }

  use() {
    invariant(
      !!this.program,
      'Error using program. No program created... call createProgram with shaders.'
    );
    this.context.useProgram(this.program);
  }

  getAttributeLocation(attribute: string): number {
    invariant(
      !!this.program,
      'Error setting attributes. No program created... call createProgram with shaders.'
    );
    const location =
      this.attributes.get(attribute) ??
      this.context.getAttribLocation(this.program, attribute);

    this.attributes.set(attribute, location);

    return location;
  }

  getUniformLocation(uniform: string): WebGLUniformLocation | null {
    invariant(
      !!this.program,
      'Error setting uniforms. No program created... call createProgram with shaders.'
    );

    const location =
      this.uniforms.get(uniform) ??
      this.context.getUniformLocation(this.program, uniform);

    this.uniforms.set(uniform, location);

    return location;
  }

  delete() {
    this.context.deleteProgram(this.program);
    this.context.deleteShader(this.vertexShader);
    this.context.deleteShader(this.fragmentShader);
  }
}
