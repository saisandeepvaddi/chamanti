import { Texture } from '../Texture';

export class Material {
  vertexShader: string;
  fragmentShader: string;
  textures?: Texture[];
  constructor(
    vertexShader: string,
    fragmentShader: string,
    textures?: Texture[]
  ) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.textures = textures;
  }
}
