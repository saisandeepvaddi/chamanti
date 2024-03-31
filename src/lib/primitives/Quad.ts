import { Material } from '../materials/Material';
import Geometry from '../meshes/Geometry';
import { Mesh } from '../meshes/Mesh';

const QUAD_VERTICES = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0];
const QUAD_INDICES = [0, 1, 2, 0, 2, 3];
const QUAD_NORMALS = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
const QUAD_TEXTURE_COORDS = [
  0,
  1, // Top Left
  0,
  0, // Bottom Left
  1,
  0, // Bottom Right
  1,
  1, // Top Right
];

export class Quad extends Mesh {
  constructor(width: number = 1, height: number = 1) {
    const scaledVertexData = QUAD_VERTICES.map((vertex, index) => {
      if (index % 3 === 0) {
        return vertex * width;
      } else if (index % 3 === 1) {
        return vertex * height;
      } else {
        return vertex;
      }
    });
    const geometry = new Geometry(
      scaledVertexData,
      QUAD_INDICES,
      QUAD_NORMALS,
      QUAD_TEXTURE_COORDS
    );
    const material = new Material();
    super(geometry, material);
  }
}
