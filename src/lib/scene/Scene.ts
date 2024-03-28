import { Camera } from '..';
import { Node } from './Node';

export class Scene {
  root: Node | null = null;
  children: Node[] = [];
  camera: Camera | null = null;
  canvas: HTMLCanvasElement | null = null;
  constructor() {
    this.root = new Node('Root');
    const aspect =
      (this.canvas?.clientWidth ?? 1) / (this.canvas?.clientHeight ?? 1);
    this.camera = new Camera(45, aspect, 0.1, 100);
  }
  addNode(node: Node) {
    this.children.push(node);
  }
  render() {}
}
