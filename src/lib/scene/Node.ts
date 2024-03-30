import { Camera } from '..';
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
  camera: Camera | null = null;
  constructor(name: string, mesh: Mesh | null = null) {
    this.name = name;
    if (mesh) {
      this.addComponent(mesh);
    }
  }
  setCamera(camera: Camera) {
    this.camera = camera;
    this.material?.setCamera(camera);
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
  setTransform(transform: Transform) {
    this.transform = transform;
  }

  addComponent(component: Component) {
    if (component instanceof Mesh) {
      this.mesh = component;
      if (!this.material) {
        this.material = new Material();
        this.material.setMesh(component);
      }
    }

    if (component instanceof Material) {
      this.material = component;
      if (this.mesh) {
        this.material.setMesh(this.mesh);
      }
    }

    if (component instanceof Camera) {
      this.camera = component;
      if (this.material) {
        this.material.setCamera(component);
      }
    }

    this.components.set(component.name, component);
  }

  isRenderable() {
    // return this.mesh !== null && this.material !== null;
    return this.mesh !== null && this.material !== null;
  }
  render(camera: Camera) {
    if (this.isRenderable()) {
      this.material?.setCamera(camera);
      this.material?.render();
    }
    for (const child of this.children) {
      child.render(camera);
    }
  }
}
