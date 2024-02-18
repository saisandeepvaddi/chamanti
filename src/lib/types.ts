export type WebGL1WithVao = WebGLRenderingContext & {
  createVertexArray: () => WebGLVertexArrayObject | null;
  bindVertexArray: (vao: WebGLVertexArrayObject | null) => void;
  deleteVertexArray: (vao: WebGLVertexArrayObject | null) => void;
};

export type GLContext = WebGL2RenderingContext | WebGL1WithVao;

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
