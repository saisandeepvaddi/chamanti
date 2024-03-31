import { Texture } from './lib/Texture';
import { Engine } from './lib/engine/Engine';
import { Quad } from './lib/primitives/Quad';
import { Node } from './lib/scene/Node';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas);
engine.start();

// const cube = new Cube();
const activeScene = engine.getActiveScene();
const quadNode = new Node('Quad', new Quad(1, 1));
// const times = 0;
// cubeNode.transform.setScale({
//   x: 3,
//   y: 3,
//   z: 3,
// });
// cubeNode.tick = (self: Node, deltaTime: number) => {
//   self.transform.updateRotationBy({
//     y: 0.1 * deltaTime,
//   });
//   // cubeNode.transform.updatePositionBy({
//   //   x: 0.001 * deltaTime,
//   // });
//   // cubeNode.transform.updateScaleBy({
//   //   x: 0.001,
//   // });
// };
activeScene.add(quadNode);
const tex = new Texture('uTexture', 'debug_texture_2.jpg');
quadNode.getMaterial().updateTexture(tex);

// const cube2 = new Cube();
// const cubeNode2 = new Node('Cube2', cube2);
// cubeNode2.transform
//   .setScale({
//     x: 0.25,
//     y: 0.25,
//     z: 0.25,
//   })
//   .setPosition({
//     x: 0.5,
//     y: 0.5,
//     z: 0.5,
//   });

// activeScene.add(cubeNode2);

// cubeNode2.tick = (self: Node, deltaTime: number) => {
//   self.transform.updateRotationBy({
//     x: 0.1 * deltaTime,
//     y: 0.1 * deltaTime,
//     z: 0.1 * deltaTime,
//   });
// };
