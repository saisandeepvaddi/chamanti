import { Material } from '../materials/Material';
import { Mesh } from '../meshes/Mesh';
import { Transform } from '../transforms/Transform';
import { Component } from './Component';

export class Node {
  name: string;
  children: Node[] = [];
  parent: Node | null = null;
  mesh: Mesh | null = null;
  material: Material | null = null;
  transform: Transform = new Transform();
  components: Map<string, Component> = new Map();
  constructor(name: string) {
    this.name = name;
  }

  addChild(child: Node) {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: Node) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
  setTransform(transform: Transform) {
    this.transform = transform;
  }

  addComponent(component: Component) {
    this.components.set(component.name, component);
  }
}
