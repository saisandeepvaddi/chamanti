import { Engine } from './lib/engine/Engine';
import { Cube } from './lib/primitives/Cube';
import { Node } from './lib/scene/Node';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas);
engine.start();

const cube = new Cube();
const activeScene = engine.getActiveScene();
const cubeNode = new Node('Cube', cube);
// cubeNode.tick = (deltaTime: number) => {
//   cubeNode.transform.updateRotationBy({ x: 0.01, y: 0.01, z: 0.01 });
// };
activeScene.add(cubeNode);
