import Chamanti from './lib';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const chamanti = new Chamanti(canvas);

const triangleData = [-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0];

chamanti.drawTriangle(triangleData);
