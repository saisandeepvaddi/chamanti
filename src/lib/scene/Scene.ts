import { Node } from './Node';

export class Scene {
  root: Node | null = null;
  children: Node[] = [];
  add(node: Node) {
    this.children.push(node);
  }

  render() {
    if (this.root) {
      this.root.render();
    }
  }
}
