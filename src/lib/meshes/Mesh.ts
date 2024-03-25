import { Material } from '../materials/Material';

export class Mesh {
  vertices: number[];
  indices: number[];
  material: Material | null = null;
  constructor(vertices: number[] = [], indices: number[] = []) {
    this.vertices = vertices;
    this.indices = indices;
  }
}
