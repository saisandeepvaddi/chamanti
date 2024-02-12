import Chamanti from './lib';
import fragmentShader from './lib/shaders/triangleFragment.glsl';
import vertexShader from './lib/shaders/triangleVertex.glsl';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const chamanti = new Chamanti(canvas);

const triangleData = [-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0];
const vertexColors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];

const renderer = chamanti.renderer;
renderer.addBufferedObject({
  attributes: [
    { name: 'aPosition', size: 3, data: triangleData },
    { name: 'aColor', size: 3, data: vertexColors },
  ],
  uniforms: [],
  vertexShader,
  fragmentShader,
});

renderer.render();
