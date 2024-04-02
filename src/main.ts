import { Texture } from './lib/Texture';
import { Engine } from './lib/engine/Engine';
import { Cube } from './lib/primitives/Cube';
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
const cubeNode = new Node('Cube', new Cube());
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
activeScene.add(cubeNode);
// const tex = new Texture('debug_texture.jpg');
// cubeNode.getMaterial().updateTexture(tex);

const baseTexture = new Texture(
  'textures/RoofShinglesOld002/RoofShinglesOld002_COL_2K_METALNESS.png',
  'baseColor'
);

const normalTexture = new Texture(
  'textures/RoofShinglesOld002/RoofShinglesOld002_NRM_2K_METALNESS.png',
  'normal'
);

// cubeNode.getMaterial().updateTexture(baseTexture);
// cubeNode.getMaterial().updateTexture(normalTexture);

cubeNode.getMaterial().updateTextures({
  baseColor: baseTexture,
  normal: normalTexture,
});
