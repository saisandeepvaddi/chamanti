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
const times = 0;
cubeNode.tick = (deltaTime: number) => {
  // cubeNode.transform.updateRotationBy({
  //   y: 0.1 * deltaTime,
  // });
  // cubeNode.transform.updatePositionBy({
  //   x: 0.001 * deltaTime,
  // });
  // cubeNode.transform.updateScaleBy({
  //   x: 0.001,
  // });
};
activeScene.add(cubeNode);
