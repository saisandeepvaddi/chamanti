import { mat4 } from 'gl-matrix';
import Chamanti from './lib';
import { Camera } from './lib/camera/Camera';
import { CameraControls } from './lib/camera/camera-controls';
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

const translation = [-1.5, 1.5, 0]; // Translation vector

const vertexData2 = [
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

const obj = renderer.addObject({
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

const obj2 = obj.clone();
renderer.addObject(obj2);

obj2.updateAttribute('aPosition', vertexData2);

const camera = new Camera(45, canvas.width / canvas.height, 0.1, 100.0);
camera.setPosition(0, 0, 5);

const controls = new CameraControls(camera, canvas);

obj.updateUniform('uViewMatrix', camera.getViewMatrix());
obj.updateUniform('uProjectionMatrix', camera.getProjectionMatrix());
obj2.updateUniform('uViewMatrix', camera.getViewMatrix());
obj2.updateUniform('uProjectionMatrix', camera.getProjectionMatrix());

camera.lookAt([0, 0, 0]);

function animate() {
  const angle = (performance.now() / 1000) * Math.PI * 0.5;
  obj.setRotation([1, 1, 1], angle);

  obj.updateUniform('uViewMatrix', camera.getViewMatrix());
  obj.updateUniform('uProjectionMatrix', camera.getProjectionMatrix());

  controls.updateCameraPosition();

  renderer.render();
  requestAnimationFrame(animate);
}

animate();
