import { mat4 } from 'gl-matrix';
import { v4 as uuid } from 'uuid';
import {
  Attribute,
  BufferObject,
  GLContext,
  TextureMap,
  Uniform,
  UniformValue,
  invariant,
} from '.';
import { Program } from './Program';
import { Texture } from './Texture';
export class RenderObject {
  id = uuid();
  name: string;
  attributes: Attribute[] = [];
  uniforms: Uniform[] = [];
  program: Program;
  context: GLContext;
  buffers: Map<string, WebGLBuffer> = new Map();
  vao: WebGLVertexArrayObject | null = null;
  textures: TextureMap[] = [];
  textureMaps: Map<string, Texture | null> = new Map();
  modelMatrix: mat4;
  wireframe: boolean = false;
  indices: number[] = [];
  indexBuffer: WebGLBuffer | null = null;
  hidden: boolean = false;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  constructor(
    context: GLContext,
    {
      name,
      vertexShader,
      fragmentShader,
      attributes,
      uniforms,
      textures,
    }: BufferObject
  ) {
    this.context = context;
    this.vertexShaderSource = vertexShader;
    this.fragmentShaderSource = fragmentShader;
    this.program = new Program(this.context, vertexShader, fragmentShader);
    invariant(!!this.program, 'WebGL createProgram failed');
    this.name = name;
    this.attributes = attributes ?? [];
    this.uniforms = uniforms ?? [];
    this.textures = textures ?? [];
    this.modelMatrix = mat4.create();

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
    this.setupTexture = this.setupTexture.bind(this);
    this.updateTexture = this.updateTexture.bind(this);
    this.setupTextures = this.setupTextures.bind(this);
    this.updateTextures = this.updateTextures.bind(this);
    this.setModelMatrix = this.setModelMatrix.bind(this);
    this.updateIndexBuffer = this.updateIndexBuffer.bind(this);
    this.setupUniforms = this.setupUniforms.bind(this);
    this.updateUniforms = this.updateUniforms.bind(this);

    this.hide = this.hide.bind(this);
    this.clone = this.clone.bind(this);
  }

  setModelMatrix(modelMatrix: mat4) {
    this.modelMatrix = modelMatrix;
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
      this.context.STATIC_DRAW
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
    if (location === -1) {
      // console.warn(`No attribute found with name ${attribute}`);
      return null;
    }
    // invariant(location !== -1, `No attribute found with name ${attribute}`);

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

  updateIndexBuffer(name: string, data: number[]) {
    const buffer = this.buffers.get(name);
    invariant(!!buffer, `No buffer found with name ${name}`);
    this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, buffer);
    this.context.bufferData(
      this.context.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(data),
      this.context.STATIC_DRAW
    );
  }

  setupAttributes() {
    this.attributes.forEach((attribute) => {
      const { name, data, size, type, normalized, stride, offset } = attribute;

      this.createBuffer(name);
      this.updateBuffer(name, new Float32Array(data));
      this.setAttribute(name, size, type, normalized, stride, offset);

      if (attribute.indices) {
        const name = attribute.name + '_index';
        this.createBuffer(name);
        this.updateIndexBuffer(name, attribute.indices);
      }
    });
  }

  setUniform(uniform: string, value: UniformValue) {
    invariant(
      !!this.program,
      'Error setting uniforms. No program created... call createProgram with shaders.'
    );

    const location = this.program.getUniformLocation(uniform);

    if (!location) {
      // warn(
      //   !!location,
      //   `No uniform found with name '${uniform}'. Check if your shader uses '${uniform}' uniform`
      // );

      return null;
    }

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
            case 9:
              this.context.uniformMatrix3fv(location, false, value);
              break;
            case 16:
              this.context.uniformMatrix4fv(location, false, value);
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

  updateUniform(uniformName: string, value: UniformValue) {
    const uniform = this.uniforms.find((u) => u.name === uniformName);
    invariant(!!uniform, `Uniform ${uniformName} not found`);
    uniform.value = value;
  }

  updateAttributes() {
    this.attributes.forEach(({ name, data, indices }) => {
      this.updateBuffer(name, new Float32Array(data));
      if (indices) {
        const indexBufferName = name + '_index';
        this.updateIndexBuffer(indexBufferName, indices);
      }
    });
  }

  updateUniforms() {
    this.uniforms.forEach(({ name, value }) => {
      this.setUniform(name, value);
    });
  }

  setupTexture(url: string, uniformName: string = 'uTexture') {
    const texture = new Texture(this.context);
    texture.uniformName = uniformName;
    const uniformLocation = this.program.getUniformLocation(uniformName);
    invariant(!!uniformLocation, `No uniform found with name ${uniformName}`);
    texture.load(url).then(() => {
      texture.uniformLocation = uniformLocation;
    });
    this.textureMaps.set(uniformName, texture);
  }

  updateTexture(uniformName: string = 'uTexture') {
    invariant(
      !!this.textureMaps.get(uniformName),
      `Texture: ${uniformName} not setup`
    );
    this.textureMaps.get(uniformName)?.update();
  }

  setupTextures() {
    this.textures.forEach((texture) => {
      if (texture) {
        this.setupTexture(texture.url, texture.name);
      }
    });
  }

  updateTextures() {
    this.textures.forEach((texture) => {
      if (texture) {
        this.updateTexture(texture.name);
      }
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
    this.setupTextures();
    this.context.bindVertexArray(null);
  }

  update() {
    this.program.use();
    this.context.bindVertexArray(this.vao);
    this.updateAttributes();
    this.updateUniforms();
    this.updateTextures();
  }

  draw() {
    this.update();
    if (this.attributes.length > 0) {
      const count = this.attributes[0].data.length / this.attributes[0].size;

      if (this.buffers.has('aPosition_index')) {
        this.context.drawElements(
          this.wireframe ? this.context.LINES : this.context.TRIANGLES,
          this.attributes[0].indices?.length ?? 0,
          this.context.UNSIGNED_SHORT,
          0
        );
      } else {
        this.context.drawArrays(
          this.wireframe ? this.context.LINES : this.context.TRIANGLES,
          0,
          count
        );
      }
    }
    this.context.flush();
  }

  hide() {
    this.hidden = true;
  }

  remove() {
    this.program.delete();
    this.context.deleteVertexArray(this.vao);
    this.buffers.forEach((buffer) => {
      this.context.deleteBuffer(buffer);
    });
  }

  clone() {
    const cloned = new RenderObject(this.context, {
      name: this.name + uuid(),
      vertexShader: this.vertexShaderSource,
      fragmentShader: this.fragmentShaderSource,
      attributes: this.attributes.map((a) => ({ ...a })),
      uniforms: this.uniforms.map((u) => ({ ...u })),
      textures: this.textures.map((t) => ({ ...t })),
    });
    return cloned;
  }
}
