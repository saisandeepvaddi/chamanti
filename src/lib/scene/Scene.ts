import { Node } from './Node';

export class Scene {
  root: Node | null = null;
  children: Node[] = [];
  canvas: HTMLCanvasElement | null = null;
  gl: WebGL2RenderingContext | null = null;
  constructor() {
    this.root = new Node('Root');
  }

  add(node: Node) {
    this.children.push(node);
  }
}
