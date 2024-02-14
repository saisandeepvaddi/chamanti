import Chamanti from './lib';
import fragmentShader from './lib/shaders/triangleFragment.glsl';
import vertexShader from './lib/shaders/triangleVertex.glsl';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const chamanti = new Chamanti(canvas);

const triangleData = [-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0];
const vertexColors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];

const renderer = chamanti.renderer;
const { updateUniform } = renderer.addBufferObject({
  name: 'triangle',
  attributes: [
    { name: 'aPosition', size: 3, data: triangleData },
    { name: 'aColor', size: 3, data: vertexColors },
  ],
  uniforms: [
    {
      name: 'uTime',
      value: 0,
    },
  ],
  vertexShader,
  fragmentShader,
});

renderer.render();

// setInterval(() => {
//   updateUniform('uTime', renderer.elapsedTime);
// }, 1000);

// renderer.startRenderLoop();
const start = Date.now();
function animate() {
  requestAnimationFrame(animate);
  updateUniform('uTime', Math.sin((Date.now() - start) / 100));
  renderer.render();
}

// animate();
