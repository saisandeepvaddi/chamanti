import { Material } from '../materials/Material';
import Geometry from '../meshes/Geometry';
import { Mesh } from '../meshes/Mesh';

const positions = [
  // Front face
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

  // Back face
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

  // Top face
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

  // Right face
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

  // Left face
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
];

const indexData = [
  0,
  1,
  2,
  0,
  2,
  3, // front
  4,
  5,
  6,
  4,
  6,
  7, // back
  8,
  9,
  10,
  8,
  10,
  11, // top
  12,
  13,
  14,
  12,
  14,
  15, // bottom
  16,
  17,
  18,
  16,
  18,
  19, // right
  20,
  21,
  22,
  20,
  22,
  23, // left
];

const textureCoordinates = [
  // Front face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

  // Back face
  1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,

  // Top face
  0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,

  // Bottom face
  1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

  // Right face
  1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,

  // Left face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
];

const cubeNormals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

export class Cube extends Mesh {
  constructor(height: number = 1, width: number = 1, depth: number = 1) {
    const scaledVertexData = positions.map((vertex, index) => {
      if (index % 3 === 0) {
        return vertex * width;
      } else if (index % 3 === 1) {
        return vertex * height;
      } else {
        return vertex * depth;
      }
    });
    const geometry = new Geometry(
      scaledVertexData,
      indexData,
      textureCoordinates,
      cubeNormals
    );
    const material = new Material();

    super(geometry, material);
  }
}
