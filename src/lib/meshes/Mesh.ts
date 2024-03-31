import { Material } from '../materials/Material';
import { Component } from '../scene/Component';
import { Transform } from '../transforms/Transform';
import Geometry from './Geometry';
import { MeshRenderer } from './MeshRenderer';

export class Mesh extends Component {
  geometry: Geometry;
  material: Material;
  transform: Transform;
  name: string = 'Mesh';
  isRenderable = true;
  meshRenderer: MeshRenderer;
  constructor(geometry: Geometry, material: Material) {
    super();
    this.transform = new Transform();
    this.geometry = geometry;
    this.material = material;
    this.meshRenderer = new MeshRenderer(this);
  }
  setName(name: string) {
    this.name = name;
  }

  onTransformChanged(transform: Transform): void {
    this.transform = transform;
    this.meshRenderer.onTransformChanged(transform);
  }

  render(delta: number) {
    this.meshRenderer.render(delta);
  }
}
