import { Mesh } from '../meshes/Mesh';

const QUAD_VERTICES = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0];
const QUAD_INDICES = [0, 1, 2, 0, 2, 3];
const QUAD_NORMALS = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
const QUAD_TEXTURE_COORDS = [0, 1, 0, 0, 1, 0, 1, 1];

export class Quad extends Mesh {
  constructor() {
    super(QUAD_VERTICES, QUAD_INDICES, QUAD_NORMALS, QUAD_TEXTURE_COORDS);
  }
}
