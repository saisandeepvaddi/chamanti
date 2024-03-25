import { mat4 } from 'gl-matrix';
import { Material } from '../materials/Material';
import { Mesh } from '../meshes/Mesh';

export class Node {
  name: string;
  children: Node[] = [];
  parent: Node | null = null;
  mesh: Mesh | null = null;
  material: Material | null = null;
  transform: mat4 = mat4.create();
  constructor(name: string) {
    this.name = name;
  }

  add(child: Node) {
    child.parent = this;
    this.children.push(child);
  }

  remove(child: Node) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
  setTransform(transform: mat4) {
    this.transform = transform;
  }

  render() {}
}
