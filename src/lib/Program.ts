import { GLContext, invariant } from '.';

export class Program {
  context: GLContext;
  private program: WebGLProgram;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private attributes: Map<string, GLint> = new Map();
  private uniforms: Map<string, WebGLUniformLocation> = new Map();

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
    this.use = this.use.bind(this);
    this.getAttributeLocation = this.getAttributeLocation.bind(this);
    this.getUniformLocation = this.getUniformLocation.bind(this);
    this.delete = this.delete.bind(this);
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
    invariant(!!this.vertexShader, 'Invalid Vertex Shader');
    invariant(!!this.fragmentShader, 'Invalid Fragment Shader');

    const program = this.context.createProgram();

    invariant(!!program, 'WebGL createProgram failed');

    this.context.attachShader(program, this.vertexShader);
    this.context.attachShader(program, this.fragmentShader);
    this.context.linkProgram(program);

    if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
      throw new Error(
        `Error linking webgl program: ${this.context.getProgramInfoLog(this.program)}`
      );
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

  getUniformLocation(uniform: string): WebGLUniformLocation {
    invariant(
      !!this.program,
      'Error setting uniforms. No program created... call createProgram with shaders.'
    );

    const location =
      this.uniforms.get(uniform) ??
      this.context.getUniformLocation(this.program, uniform);

    invariant(!!location, `No uniform found with name ${uniform}`);

    this.uniforms.set(uniform, location);

    return location;
  }

  delete() {
    this.context.deleteProgram(this.program);
    this.context.deleteShader(this.vertexShader);
    this.context.deleteShader(this.fragmentShader);
  }
}
