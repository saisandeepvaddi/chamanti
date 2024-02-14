export type GLContext = WebGL2RenderingContext | WebGLRenderingContext;

export type Attribute = {
  name: string;
  data: number[];
  size: number;
  type?: number;
  normalized?: boolean;
  stride?: number;
  offset?: number;
};

export type Uniform = {
  name: string;
  value: number | boolean | number[] | Float32Array;
};

export type BufferObject = {
  name: string;
  vertexShader: string;
  fragmentShader: string;
  attributes?: Attribute[];
  uniforms?: Uniform[];
};
