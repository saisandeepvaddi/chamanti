import { Camera, invariant } from '..';
import { Mesh } from '../meshes/Mesh';
import { Transform, Transformable } from '../transforms/Transform';
import { Component } from './Component';

export class Node implements Transformable {
  name: string;
  children: Node[] = [];
  parent: Node | null = null;
  mesh: Mesh | null = null;
  transform: Transform;
  components: Map<string, Component> = new Map();
  camera: Camera | null = null;
  tickCallback: ((self: Node, deltaTime: number) => void) | null = null;
  constructor(name: string, mesh: Mesh | null = null) {
    this.name = name;
    if (mesh) {
      this.addComponent(mesh);
    }
    this.transform = new Transform(this);
  }

  onTransformChanged(transform: Transform) {
    this.transform = transform;
    this.components.forEach((component) => {
      component.onTransformChanged(transform);
    });
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

  addComponent(component: Component) {
    if (component instanceof Mesh) {
      this.mesh = component;
    }

    this.components.set(component.name, component);
  }
  getMesh() {
    invariant(!!this.mesh, 'No mesh set.');
    return this.mesh;
  }
  getMaterial() {
    invariant(!!this.mesh, 'No mesh set.');
    return this.mesh.material;
  }
  isRenderable() {
    return this.mesh !== null;
  }
  render(delta: number) {
    if (this.isRenderable()) {
      this.mesh?.render(delta);
    }
    for (const child of this.children) {
      child.render(delta);
    }
    this.tickCallback?.(this, delta);
  }
  set tick(callback: (self: Node, deltaTime: number) => void) {
    this.tickCallback = callback;
  }
}
