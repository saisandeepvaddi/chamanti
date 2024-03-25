import { Mesh } from '../meshes/Mesh';

export class Cube extends Mesh {
  height: number;
  width: number;
  depth: number;
  constructor(height = 1, width = 1, depth = 1) {
    super();
    this.height = height;
    this.width = width;
    this.depth = depth;
  }
}
