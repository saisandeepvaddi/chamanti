import { Camera, CameraControls } from './lib';
import { Mesh } from './lib/meshes/Mesh';
import { Cube } from './lib/primitives/Cube';
import { WebGL2Renderer } from './lib/renderers/WebGL2Renderer';
import { Node } from './lib/scene/Node';
import { Scene } from './lib/scene/Scene';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const renderer = new WebGL2Renderer(canvas);

const scene = new Scene();

// const node = new Node('Quad');
// const quad: Mesh = new Quad();
// node.addComponent(quad);
// scene.addNode(node);

const node2 = new Node('Cube');
const cube: Mesh = new Cube();
node2.addComponent(cube);
scene.addNode(node2);

renderer.setScene(scene);

const camera = new Camera(45, canvas.width / canvas.height, 0.1, 100);
camera.setPosition(0, 0, 5);
camera.lookAt([0, 0, 0]);
renderer.setCamera(camera);

const controls = new CameraControls(camera, canvas);

function render() {
  controls.updateCameraPosition();
  renderer.render();
  requestAnimationFrame(render);
}

render();
