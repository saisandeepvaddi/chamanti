import { BufferObject, GL, invariant } from './';

export class Renderer {
  gl: GL;
  elapsedTime: number = 0;
  prevFrameTime: number = 0;
  renderObjects: BufferObject[] = [];
  rafId: number | null = null;
  constructor(gl: GL) {
    this.gl = gl;
  }
  startRenderLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    const animate = (time: number) => {
      const deltaTime = time - this.prevFrameTime;
      this.prevFrameTime = time;
      this.elapsedTime += deltaTime;
      this.render(deltaTime);
      this.rafId = requestAnimationFrame(animate);
    };
    this.rafId = requestAnimationFrame(animate);
  }

  updateAttribute(objectName: string, attributeName: string, data: number[]) {
    const object = this.renderObjects.find((o) => o.name === objectName);
    invariant(!!object, `Object ${objectName} not found`);

    const attribute = object.attributes?.find((a) => a.name === attributeName);
    invariant(!!attribute, `Attribute ${attributeName} not found`);

    attribute.data = data;
    this.startRenderLoop();
  }

  updateUniform(objectName: string, uniformName: string, value: number) {
    const object = this.renderObjects.find((o) => o.name === objectName);
    invariant(!!object, `Object ${objectName} not found`);

    const uniform = object.uniforms?.find((u) => u.name === uniformName);
    invariant(!!uniform, `Uniform ${uniformName} not found`);
    uniform.value = value;
    this.startRenderLoop();
  }

  private setupBuffers(options: BufferObject) {
    const { attributes = [], uniforms = [] } = options;

    attributes.forEach(({ name, size, type, normalized, stride, offset }) => {
      this.gl.setAttribute(name, size, type, normalized, stride, offset);
      this.gl.createBuffer(name);
    });
    uniforms.forEach(({ name, value }) => {
      this.gl.setUniform(name, value);
    });
  }

  private updateBuffers(options: BufferObject) {
    const { attributes = [], uniforms = [] } = options;

    attributes.forEach(
      ({ name, data, size, normalized, offset, stride, type }) => {
        this.gl.updateBuffer(name, new Float32Array(data));
        this.gl.setAttribute(name, size, type, normalized, stride, offset);
      }
    );

    uniforms.forEach(({ name, value }) => {
      this.gl.setUniform(name, value);
    });
  }

  addBufferObject(object: BufferObject) {
    const program = this.gl.createProgram(
      object.vertexShader,
      object.fragmentShader
    );
    this.setupBuffers(object);
    this.renderObjects.push(object);

    return {
      updateAttribute: (name: string, data: number[]) => {
        this.updateAttribute(object.name, name, data);
      },
      updateUniform: (name: string, value: number) => {
        this.updateUniform(object.name, name, value);
      },
      remove: () => {
        this.renderObjects = this.renderObjects.filter(
          (renderObject) => renderObject !== object
        );
        program.delete();
        this.startRenderLoop();
      },
    };
  }

  private drawBuffer(options: BufferObject) {
    const { attributes = [] } = options;

    if (attributes.length > 0) {
      const count = attributes[0].data.length / attributes[0].size;
      this.gl.context.drawArrays(this.gl.context.TRIANGLES, 0, count);
    }
  }

  render(deltaTime: number = 0) {
    this.gl.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.context.clear(
      this.gl.context.COLOR_BUFFER_BIT | this.gl.context.DEPTH_BUFFER_BIT
    );

    this.renderObjects.forEach((object) => {
      this.gl.useProgram();
      this.updateBuffers(object);
      this.drawBuffer(object);
    });
  }
}