import { mat3, mat4 } from 'gl-matrix';

export type WebGL1WithVao = WebGLRenderingContext & {
  createVertexArray: () => WebGLVertexArrayObject | null;
  bindVertexArray: (vao: WebGLVertexArrayObject | null) => void;
  deleteVertexArray: (vao: WebGLVertexArrayObject | null) => void;
};

export type GLContext = WebGL2RenderingContext | WebGL1WithVao;

export type Attribute = {
  name: string;
  data: number[];
  indices?: number[];
  size: number;
  type?: number;
  normalized?: boolean;
  stride?: number;
  offset?: number;
};

export type UniformValue =
  | number
  | boolean
  | number[]
  | Float32Array
  | mat3
  | mat4;

export type Uniform = {
  name: string;
  value: UniformValue;
};

export type TextureMap = {
  name: string;
  url: string;
};

export type BufferObject = {
  name: string;
  vertexShader: string;
  fragmentShader: string;
  attributes?: Attribute[];
  uniforms?: Uniform[];
  textures?: TextureMap[];
};
