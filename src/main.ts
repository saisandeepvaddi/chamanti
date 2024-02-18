import Chamanti from './lib';
import fragmentShader from './lib/shaders/triangleFragment.glsl';
import vertexShader from './lib/shaders/triangleVertex.glsl';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const chamanti = new Chamanti(canvas);

const triangleData1 = [
  -0.5,
  -0.5,
  0, // First triangle
  0.5,
  -0.5,
  0,
  -0.5,
  0.5,
  0,
  -0.5,
  0.5,
  0, // Second triangle
  0.5,
  -0.5,
  0,
  0.5,
  0.5,
  0,
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
  1.0, // Blue color for third vertex
  1.0,
  0.0,
  0.0, // Red color for fourth vertex (repeat or new color)
  0.0,
  1.0,
  0.0, // Green color for fifth vertex (repeat or new color)
  0.0,
  0.0,
  1.0, // Blue color for sixth vertex (repeat or new color)
];

const renderer = chamanti.renderer;
const { updateUniform: updateUniform1 } = renderer.addBufferObject({
  name: 'rectangle',
  attributes: [
    { name: 'aPosition', size: 3, data: triangleData1 },
    { name: 'aColor', size: 3, data: vertexColors1 },
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

// const triangleData2 = [0.5, 0.5, 0.0, 0.75, -0.75, 0.0, 0.0, 0.75, 0.0];
// const vertexColors2 = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0];
// const { updateUniform: updateUniform2 } = renderer.addBufferObject({
//   name: 'triangle2',
//   attributes: [
//     { name: 'aPosition', size: 3, data: triangleData2 },
//     { name: 'aColor', size: 3, data: vertexColors2 },
//   ],
//   uniforms: [
//     {
//       name: 'uTime',
//       value: 0,
//     },
//   ],
//   vertexShader,
//   fragmentShader,
// });

// renderer.render();

// remove1();

// setInterval(() => {
//   updateUniform('uTime', renderer.elapsedTime);
// }, 1000);

// renderer.startRenderLoop();
const start = performance.now();
function animate() {
  updateUniform1('uTime', Math.sin((performance.now() - start) / 1000));
  // updateUniform2('uTime', Math.sin((performance.now() - start) / 500));
  renderer.render();
  requestAnimationFrame(animate);
}

animate();
