import Chamanti from './lib';
import { Mesh } from './lib/meshes/Mesh';
import { Quad } from './lib/primitives/Quad';
import { Node } from './lib/scene/Node';
import { Scene } from './lib/scene/Scene';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chamanti = new Chamanti(canvas);

const renderer = chamanti.renderer;

const scene = new Scene();

const node = new Node('cube');
const quad: Mesh = new Quad();
node.addComponent(quad);

scene.addNode(node);

renderer.setScene(scene);

renderer.render();
