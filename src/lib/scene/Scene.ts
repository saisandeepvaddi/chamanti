import { GLContext } from '..';
import { Node } from './Node';

export class Scene {
  glContext: GLContext;
  root: Node | null = null;
  constructor(glContext: GLContext) {
    this.glContext = glContext;
    this.root = new Node('root');
  }
  setRoot(root: Node) {
    this.root = root;
  }

  render() {
    if (this.root) {
      this.root.render();
    }
  }
}
