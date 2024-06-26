export const translation = [-1.5, 1.5, 0]; // Translation vector

export const vertexData = [
  // Front face
  -0.75 + translation[0],
  -0.75 + translation[1],
  0.75 + translation[2], // Vertex 0
  0.75 + translation[0],
  -0.75 + translation[1],
  0.75 + translation[2], // Vertex 1
  0.75 + translation[0],
  0.75 + translation[1],
  0.75 + translation[2], // Vertex 2
  -0.75 + translation[0],
  0.75 + translation[1],
  0.75 + translation[2], // Vertex 3
  // Back face
  -0.75 + translation[0],
  -0.75 + translation[1],
  -0.75 + translation[2], // Vertex 4
  0.75 + translation[0],
  -0.75 + translation[1],
  -0.75 + translation[2], // Vertex 5
  0.75 + translation[0],
  0.75 + translation[1],
  -0.75 + translation[2], // Vertex 6
  -0.75 + translation[0],
  0.75 + translation[1],
  -0.75 + translation[2], // Vertex 7
];

export const solidFaceIndices = [
  // Front face
  0, 1, 2, 0, 2, 3,
  // Back face
  4, 6, 5, 4, 7, 6,
  // Top face
  3, 2, 6, 3, 6, 7,
  // Bottom face
  4, 5, 1, 4, 1, 0,
  // Right face
  1, 5, 6, 1, 6, 2,
  // Left face
  4, 0, 3, 4, 3, 7,
];

export const textureCoords = [
  // Front face
  0.0,
  1.0, // Vertex 0
  1.0,
  1.0, // Vertex 1
  1.0,
  0.0, // Vertex 2
  0.0,
  0.0, // Vertex 3
  // Back face
  0.0,
  1.0, // Vertex 4
  1.0,
  1.0, // Vertex 5
  1.0,
  0.0, // Vertex 6
  0.0,
  0.0, // Vertex 7
];
