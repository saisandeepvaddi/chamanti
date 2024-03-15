import defaultFragmentShader from '../shaders/defaultFragment.glsl';
import defaultVertexShader from '../shaders/defaultVertex.glsl';
import { Material } from './Material';

export const defaultMaterial = new Material(
  defaultVertexShader,
  defaultFragmentShader
);
