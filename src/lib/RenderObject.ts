import { v4 as uuid } from 'uuid';
import { Attribute, BufferObject, GLContext, Uniform, invariant } from '.';
import { Program } from './Program';
export class RenderObject {
  id = uuid();
  name: string;
  attributes: Attribute[] = [];
  uniforms: Uniform[] = [];
  program: Program;
  context: GLContext;
  buffers: Map<string, WebGLBuffer> = new Map();
  vao: WebGLVertexArrayObject | null = null;
  constructor(
    context: GLContext,
    { name, vertexShader, fragmentShader, attributes, uniforms }: BufferObject
  ) {
    this.context = context;
    this.program = new Program(this.context, vertexShader, fragmentShader);
    invariant(!!this.program, 'WebGL createProgram failed');
    this.name = name;
    this.attributes = attributes ?? [];
    this.uniforms = uniforms ?? [];

    this.setupAttributes = this.setupAttributes.bind(this);
    this.setup = this.setup.bind(this);
    this.update = this.update.bind(this);
    this.updateAttributes = this.updateAttributes.bind(this);
    this.updateUniform = this.updateUniform.bind(this);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.setAttribute = this.setAttribute.bind(this);
    this.setUniform = this.setUniform.bind(this);
    this.updateBuffer = this.updateBuffer.bind(this);
    this.createBuffer = this.createBuffer.bind(this);
    this.remove = this.remove.bind(this);
    this.draw = this.draw.bind(this);
  }

  private createBuffer(name: string) {
    const buffer = this.buffers.get(name) ?? this.context.createBuffer();
    invariant(!!buffer, 'Error binding buffers. WebGL createBuffer failed');
    this.buffers.set(name, buffer);
    return buffer;
  }

  updateBuffer(name: string, data: Float32Array) {
    const buffer = this.buffers.get(name);
    invariant(!!buffer, `No buffer found with name ${name}`);
    this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
    this.context.bufferData(
      this.context.ARRAY_BUFFER,
      data,
      this.context.DYNAMIC_DRAW
    );
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

  setupAttributes() {
    this.attributes.forEach(
      ({ name, size, type, normalized, stride, offset, data }) => {
        this.createBuffer(name);
        this.updateBuffer(name, new Float32Array(data));
        this.setAttribute(name, size, type, normalized, stride, offset);
      }
    );
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

  setupUniforms() {
    this.uniforms.forEach(({ name, value }) => {
      this.setUniform(name, value);
    });
  }

  updateAttribute(attributeName: string, data: number[]) {
    const attribute = this.attributes.find((a) => a.name === attributeName);
    invariant(!!attribute, `Attribute ${attributeName} not found`);

    attribute.data = data;
  }

  updateUniform(uniformName: string, value: number) {
    const uniform = this.uniforms.find((u) => u.name === uniformName);
    invariant(!!uniform, `Uniform ${uniformName} not found`);
    uniform.value = value;
  }

  updateAttributes() {
    this.attributes.forEach(({ name, data }) => {
      this.updateBuffer(name, new Float32Array(data));
    });
  }

  updateUniforms() {
    this.uniforms.forEach(({ name, value }) => {
      this.setUniform(name, value);
    });
  }

  setup() {
    this.program.use();
    const vao = this.vao ?? this.context.createVertexArray();
    invariant(!!vao, 'Error creating vertex array object');
    this.vao = vao;
    this.context.bindVertexArray(vao);
    this.setupAttributes();
    this.setupUniforms();
    this.context.bindVertexArray(null);
  }

  update() {
    this.program.use();

    this.context.bindVertexArray(this.vao);
    this.updateAttributes();
    this.updateUniforms();
    this.context.bindVertexArray(null);
  }

  draw() {
    if (this.attributes.length > 0) {
      const count = this.attributes[0].data.length / this.attributes[0].size;
      this.context.drawArrays(this.context.TRIANGLES, 0, count);
    }
  }

  remove() {
    this.program.delete();
    this.context.deleteVertexArray(this.vao);
    this.buffers.forEach((buffer) => {
      this.context.deleteBuffer(buffer);
    });
  }
}
