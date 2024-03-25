import Chamanti from './lib';
import { Cube } from './lib/primitives/cube';
import { Scene } from './lib/scene/Scene';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chamanti = new Chamanti(canvas);

const renderer = chamanti.renderer;

const scene = new Scene();

const cube = new Cube();
