import { GlobalState } from '../state/global';
import { Node } from './Node';

export class Scene {
  root: Node | null = null;
  children: Node[] = [];
  canvas: HTMLCanvasElement | null = null;
  gl: WebGL2RenderingContext | null = null;
  constructor() {
    this.root = new Node('Root');
  }

  setContext(gl: WebGL2RenderingContext) {
    this.gl = gl;
    GlobalState.gl = gl;
  }
  addNode(node: Node) {
    this.children.push(node);
  }
}
