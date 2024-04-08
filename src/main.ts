import { vec4 } from 'gl-matrix';
import { Texture } from './lib/Texture';
import { Engine } from './lib/engine/Engine';
import { Cube } from './lib/primitives/Cube';
import { Node } from './lib/scene/Node';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas);
engine.start();

// const cube = new Cube();
const scene = engine.getActiveScene();
// const quadNode = new Node('Quad', new Quad(2, 2));
// scene.add(quadNode);

const cube = new Cube();
const cubeNode = new Node('Cube', cube);
scene.add(cubeNode);

cube.material.setColor(vec4.fromValues(1.0, 0.0, 0.0, 1.0));
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
// scene.add(cubeNode);
// const tex = new Texture('debug_texture.jpg');
// cubeNode.getMaterial().updateTexture(tex);

const baseTexture = new Texture(
  'diffuse',
  'textures/RoofShinglesOld002/RoofShinglesOld002_COL_2K_METALNESS.png'
);

const normalTexture = new Texture(
  'normal',
  'textures/RoofShinglesOld002/RoofShinglesOld002_NRM_2K_METALNESS.png'
);

cubeNode.getMaterial().updateTextures({
  diffuse: baseTexture,
  normal: normalTexture,
});

// cubeNode.getMaterial().updateTexture(baseTexture);
// cubeNode.getMaterial().updateTexture(normalTexture);

// quadNode.getMaterial().updateTextures({
//   diffuse: baseTexture,
//   normal: normalTexture,
// });
