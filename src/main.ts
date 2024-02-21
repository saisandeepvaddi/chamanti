import { mat4 } from 'gl-matrix';
import Chamanti from './lib';
import { Camera } from './lib/Camera';
import modelFragmentShader from './lib/shaders/modelFragment.glsl';
import modelVetexShader from './lib/shaders/modelVertex.glsl';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const chamanti = new Chamanti(canvas);

const renderer = chamanti.renderer;

// Create a vertex data and create the renderobject with addBufferObject for rendering a 3d cube that is slightly rotated

const vertexData = [
  // Front face
  -0.5,
  -0.5,
  0.5, // Bottom left
  0.5,
  -0.5,
  0.5, // Bottom right
  0.5,
  0.5,
  0.5, // Top right
  0.5,
  0.5,
  0.5, // Top right
  -0.5,
  0.5,
  0.5, // Top left
  -0.5,
  -0.5,
  0.5, // Bottom left

  // Back face
  -0.5,
  -0.5,
  -0.5, // Bottom left
  -0.5,
  0.5,
  -0.5, // Top left
  0.5,
  0.5,
  -0.5, // Top right
  0.5,
  0.5,
  -0.5, // Top right
  0.5,
  -0.5,
  -0.5, // Bottom right
  -0.5,
  -0.5,
  -0.5, // Bottom left

  // Top face
  -0.5,
  0.5,
  -0.5, // Top left back
  0.5,
  0.5,
  -0.5, // Top right back
  0.5,
  0.5,
  0.5, // Top right front
  0.5,
  0.5,
  0.5, // Top right front
  -0.5,
  0.5,
  0.5, // Top left front
  -0.5,
  0.5,
  -0.5, // Top left back

  // Bottom face
  -0.5,
  -0.5,
  -0.5, // Bottom left back
  0.5,
  -0.5,
  0.5, // Bottom right front
  0.5,
  -0.5,
  -0.5, // Bottom right back
  0.5,
  -0.5,
  0.5, // Bottom right front
  -0.5,
  -0.5,
  -0.5, // Bottom left back
  -0.5,
  -0.5,
  0.5, // Bottom left front

  // Right face
  0.5,
  -0.5,
  -0.5, // Bottom right back
  0.5,
  0.5,
  0.5, // Top right front
  0.5,
  -0.5,
  0.5, // Bottom right front
  0.5,
  0.5,
  0.5, // Top right front
  0.5,
  -0.5,
  -0.5, // Bottom right back
  0.5,
  0.5,
  -0.5, // Top right back

  // Left face
  -0.5,
  -0.5,
  -0.5, // Bottom left back
  -0.5,
  -0.5,
  0.5, // Bottom left front
  -0.5,
  0.5,
  0.5, // Top left front
  -0.5,
  0.5,
  0.5, // Top left front
  -0.5,
  0.5,
  -0.5, // Top left back
  -0.5,
  -0.5,
  -0.5, // Bottom left back
];

const obj = renderer.addBufferObject({
  name: 'cube',
  attributes: [{ name: 'aPosition', size: 3, data: vertexData }],
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
});

obj.wireframe = true;

const camera = new Camera(45, canvas.width / canvas.height, 0.1, 100.0);
camera.setPosition(2, 3, 5);

obj.updateUniform('uViewMatrix', camera.getViewMatrix());
obj.updateUniform('uProjectionMatrix', camera.getProjectionMatrix());
camera.lookAt([0, 0, 0], [0, 1, 0]);

function animate() {
  renderer.render();
  requestAnimationFrame(animate);
}

animate();
