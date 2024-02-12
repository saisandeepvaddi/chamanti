import { GL, RenderDataObject } from './';

export class Renderer {
  gl: GL;

  prevFrameTime: number = 0;
  renderObjects: RenderDataObject[] = [];
  rafId: number | null = null;
  constructor(gl: GL) {
    this.gl = gl;
  }
  startRenderLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    const render = (time: number) => {
      const deltaTime = time - this.prevFrameTime;
      this.prevFrameTime = time;
      this.render(deltaTime);
      this.rafId = requestAnimationFrame(render);
    };
    this.rafId = requestAnimationFrame(render);
  }

  addBufferedObject(object: RenderDataObject, autoRender = false) {
    this.renderObjects.push(object);
    if (autoRender) {
      this.startRenderLoop();
    }
  }

  drawBuffer(options: RenderDataObject) {
    const {
      attributes = [],
      uniforms = [],
      vertexShader,
      fragmentShader,
    } = options;
    this.gl.createProgram(vertexShader, fragmentShader);
    attributes.forEach(
      ({ name, size, type, normalized, stride, data, offset }) => {
        this.gl.createBuffer(new Float32Array(data));
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

  render(deltaTime: number = 0) {
    this.gl.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.context.clear(this.gl.context.COLOR_BUFFER_BIT);
    this.renderObjects.forEach((object) => {
      this.drawBuffer(object);
    });
  }
}
