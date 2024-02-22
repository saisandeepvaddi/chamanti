import { mat4 } from 'gl-matrix';
import Chamanti from './lib';
import { Camera } from './lib/Camera';
import modelFragmentShader from './lib/shaders/modelFragment.glsl';
import modelVetexShader from './lib/shaders/modelVertex.glsl';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chamanti = new Chamanti(canvas);

const renderer = chamanti.renderer;

const vertexData = [
  // Front face
  -0.5,
  -0.5,
  0.5, // Vertex 0
  0.5,
  -0.5,
  0.5, // Vertex 1
  0.5,
  0.5,
  0.5, // Vertex 2
  -0.5,
  0.5,
  0.5, // Vertex 3
  // Back face
  -0.5,
  -0.5,
  -0.5, // Vertex 4
  0.5,
  -0.5,
  -0.5, // Vertex 5
  0.5,
  0.5,
  -0.5, // Vertex 6
  -0.5,
  0.5,
  -0.5, // Vertex 7
];

// const wireframeIndices = [
//   // Front face
//   0,
//   1,
//   1,
//   2,
//   2,
//   3,
//   3,
//   0, // Outer edges
//   0,
//   2, // Diagonal

//   // Back face
//   4,
//   5,
//   5,
//   6,
//   6,
//   7,
//   7,
//   4, // Outer edges
//   5,
//   7, // Diagonal

//   // Top face
//   3,
//   2,
//   2,
//   6,
//   6,
//   7,
//   7,
//   3, // Outer edges
//   2,
//   7, // Diagonal

//   // Bottom face
//   0,
//   1,
//   1,
//   5,
//   5,
//   4,
//   4,
//   0, // Outer edges
//   1,
//   4, // Diagonal

//   // Right face
//   1,
//   2,
//   2,
//   6,
//   6,
//   5,
//   5,
//   1, // Outer edges
//   2,
//   5, // Diagonal

//   // Left face
//   0,
//   3,
//   3,
//   7,
//   7,
//   4,
//   4,
//   0, // Outer edges
//   3,
//   4, // Diagonal
// ];

const solidFaceIndices = [
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

const textureCoords = [
  // Front face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

  // Back face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

  // Top face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

  // Bottom face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

  // Right face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

  // Left face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
];

const obj = renderer.addBufferObject({
  name: 'cube',
  attributes: [
    { name: 'aPosition', size: 3, data: vertexData, indices: solidFaceIndices },
    { name: 'aTexCoord', size: 2, data: textureCoords },
  ],
  uniforms: [
    {
      name: 'uTime',
      value: 0,
    },
    {
      name: 'uViewMatrix',
      value: mat4.create(),
    },
    {
      name: 'uProjectionMatrix',
      value: mat4.create(),
    },
    {
      name: 'uModelMatrix',
      value: mat4.create(),
    },
  ],
  vertexShader: modelVetexShader,
  fragmentShader: modelFragmentShader,
  textures: [
    {
      name: 'uTexture',
      url: '/debug_texture.jpg',
    },
  ],
});

obj.wireframe = false;

const camera = new Camera(45, canvas.width / canvas.height, 0.1, 100.0);
camera.setPosition(2, 3, 5);

obj.updateUniform('uViewMatrix', camera.getViewMatrix());
obj.updateUniform('uProjectionMatrix', camera.getProjectionMatrix());
camera.lookAt([0, 0, 0], [0, 1, 0]);

const modelMatrix = mat4.create();
function animate() {
  const angle = (performance.now() / 1000) * Math.PI * 0.5;
  obj.updateUniform('uModelMatrix', mat4.fromYRotation(modelMatrix, angle));
  renderer.render();
  requestAnimationFrame(animate);
}

animate();
