import { v4 as uuid } from 'uuid';
import { Attribute, BufferObject, Uniform, UniformValue, invariant } from '..';
import { Program } from '../Program';
import { Texture } from '../Texture';
import { getGlobalState } from '../state/global';
import { Transform } from '../transforms/Transform';

export class RenderObject {
  id = uuid();
  name: string;
  attributes: Attribute[] = [];
  uniforms: Uniform[] = [];
  program: Program;
  gl: WebGL2RenderingContext;
  buffers: Map<string, WebGLBuffer> = new Map();
  vao: WebGLVertexArrayObject | null = null;
  textures: Texture[] = [];
  textureMaps: Map<string, Texture | null> = new Map();
  wireframe: boolean = false;
  indexBuffer: WebGLBuffer | null = null;
  useIndices: boolean = false;
  hidden: boolean = false;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  transform: Transform;
  constructor(
    {
      name,
      vertexShader,
      fragmentShader,
      attributes,
      uniforms,
      textures,
    }: BufferObject,
    transform: Transform
  ) {
    this.gl = getGlobalState().gl;
    this.vertexShaderSource = vertexShader;
    this.fragmentShaderSource = fragmentShader;
    this.program = new Program(this.gl, vertexShader, fragmentShader);
    invariant(!!this.program, 'WebGL createProgram failed');
    this.name = name;
    this.attributes = attributes ?? [];
    this.uniforms = uniforms ?? [];
    this.textures = textures ?? [];

    this.transform = transform;
  }

  onTransformChanged(transform: Transform) {
    this.transform = transform;
    this.updateUniform('uModelMatrix', this.transform.localMatrix);
  }

  private createBuffer(name: string) {
    const buffer = this.buffers.get(name) ?? this.gl.createBuffer();
    invariant(!!buffer, 'Error binding buffers. WebGL createBuffer failed');
    this.buffers.set(name, buffer);
    return buffer;
  }

  updateBuffer(name: string, data: Float32Array) {
    const buffer = this.buffers.get(name);
    invariant(!!buffer, `No buffer found with name ${name}`);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  }

  setAttribute(
    attribute: string,
    size: number,
    type: number = this.gl.FLOAT,
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

    this.gl.vertexAttribPointer(
      location,
      size,
      type,
      normalized,
      stride,
      offset
    );
    this.gl.enableVertexAttribArray(location);
  }

  updateIndexBuffer(name: string, data: number[]) {
    const buffer = this.buffers.get(name);
    invariant(!!buffer, `No buffer found with name ${name}`);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(data),
      this.gl.STATIC_DRAW
    );
  }
  prepareAttribute(attribute: Attribute) {
    const { name, data, size, type, normalized, stride, offset } = attribute;

    this.createBuffer(name);
    this.updateBuffer(name, new Float32Array(data));
    this.setAttribute(name, size, type, normalized, stride, offset);

    if (attribute.indices) {
      this.useIndices = true;
      const name = attribute.name + '_index';
      this.createBuffer(name);
      this.updateIndexBuffer(name, attribute.indices);
    }
  }

  addAttribute(attribute: Attribute) {
    // Check if attribute already exists
    const existingAttribute = this.attributes.find(
      (a) => a.name === attribute.name
    );

    invariant(
      !existingAttribute,
      'Attribute already exists. Use updateAttribute to update.'
    );

    this.attributes.push(attribute);
    this.prepareAttribute(attribute);
  }

  setupAttributes() {
    this.attributes.forEach((attribute) => {
      this.prepareAttribute(attribute);
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
        this.gl.uniform1f(location, value);
        break;
      case 'boolean':
        this.gl.uniform1i(location, value ? 1 : 0);
        break;
      case 'object':
        if (value instanceof Float32Array) {
          switch (value.length) {
            case 1:
              this.gl.uniform1fv(location, value);
              break;
            case 2:
              this.gl.uniform2fv(location, value);
              break;
            case 3:
              this.gl.uniform3fv(location, value);
              break;
            case 4:
              this.gl.uniform4fv(location, value);
              break;
            case 9:
              this.gl.uniformMatrix3fv(location, false, value);
              break;
            case 16:
              this.gl.uniformMatrix4fv(location, false, value);
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

  setupTexture(texture: Texture) {
    // const texture =
    //   typeof tex === 'string' ? new Texture(uniformName, tex) : tex;
    const uniformLocation = this.program.getUniformLocation(texture.name);
    invariant(!!uniformLocation, `No uniform found with name ${texture.name}`);
    texture.uniformLocation = uniformLocation;
    this.textureMaps.set(texture.name, texture);
    // texture.loadImage().then(() => {
    //   texture.uniformLocation = uniformLocation;
    // });
    // this.textureMaps.set(uniformName, texture);
  }

  updateTexture(texture: Texture) {
    invariant(
      !!this.textureMaps.get(texture.name),
      `Texture: ${texture.name} not setup`
    );
    // if (url) {
    //   this.textureMaps
    //     .get(uniformName)
    //     ?.setURL(url)
    //     ?.then(() => {
    //       this.textureMaps.get(uniformName)?.update();
    //     });
    // } else {
    //   this.textureMaps.get(uniformName)?.update();
    // }
    this.textureMaps.get(texture.name)?.update();
  }

  setupTextures() {
    this.textures.forEach((texture) => {
      if (texture) {
        this.setupTexture(texture);
      }
    });
  }

  updateTextures() {
    this.textures.forEach((texture) => {
      this.updateTexture(texture);
    });
  }

  setup() {
    this.program.use();

    const vao = this.vao ?? this.gl.createVertexArray();
    invariant(!!vao, 'Error creating vertex array object');

    this.vao = vao;
    this.gl.bindVertexArray(vao);
    this.setupAttributes();
    this.setupUniforms();
    this.setupTextures();
    this.gl.bindVertexArray(null);
  }

  update() {
    this.program.use();
    this.updateAttributes();
    this.updateUniforms();
    this.updateTextures();
  }

  draw() {
    this.gl.bindVertexArray(this.vao);
    this.update();
    if (this.attributes.length > 0) {
      const count = this.attributes[0].data.length / this.attributes[0].size;

      if (this.useIndices) {
        this.gl.drawElements(
          this.wireframe ? this.gl.LINES : this.gl.TRIANGLES,
          this.attributes[0].indices?.length ?? 0,
          this.gl.UNSIGNED_SHORT,
          0
        );
      } else {
        this.gl.drawArrays(
          this.wireframe ? this.gl.LINES : this.gl.TRIANGLES,
          0,
          count
        );
      }
    }
    this.gl.bindVertexArray(null);
    this.gl.flush();
  }

  hide() {
    this.hidden = true;
  }

  remove() {
    this.program.delete();
    this.gl.deleteVertexArray(this.vao);
    this.buffers.forEach((buffer) => {
      this.gl.deleteBuffer(buffer);
    });
  }
}
