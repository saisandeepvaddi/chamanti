import Chamanti from './lib';
import fragmentShader from './lib/shaders/triangleFragment.glsl';
import vertexShader from './lib/shaders/triangleVertex.glsl';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const chamanti = new Chamanti(canvas);

const triangleData1 = [
  -0.5,
  0.5,
  0.0, // first vertex
  -0.5,
  -0.5,
  0.0, // second vertex
  0.5,
  -0.5,
  0.0, // third vertex
];

const vertexColors1 = [
  1.0,
  0.0,
  0.0, // Red color for first vertex
  0.0,
  1.0,
  0.0, // Green color for second vertex
  0.0,
  0.0,
  1.0,
];

const textureCoordinates = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0];

const renderer = chamanti.renderer;
const { updateTexture } = renderer.addBufferObject({
  name: 'rectangle',
  attributes: [
    { name: 'aPosition', size: 3, data: triangleData1 },
    { name: 'aColor', size: 3, data: vertexColors1 },
    { name: 'aTexCoord', size: 2, data: textureCoordinates },
  ],
  uniforms: [
    {
      name: 'uTime',
      value: 0,
    },
  ],
  textures: [
    {
      name: 'uTexture',
      url: '/texture.jpg',
    },
  ],
  vertexShader,
  fragmentShader,
});

function animate() {
  updateTexture('uTexture');
  renderer.render();
  requestAnimationFrame(animate);
}

animate();
