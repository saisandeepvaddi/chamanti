import { Camera } from '..';
import { Mesh } from '../meshes/Mesh';
import { Component } from '../scene/Component';
import { getGlobalState } from '../state/global';
import { Transform } from '../transforms/Transform';
export class Material extends Component {
  name: string;
  transform: Transform;
  mesh: Mesh | null = null;
  camera: Camera;
  constructor(name: string = 'Material') {
    super();
    this.name = name;
    this.transform = new Transform();
    this.camera = getGlobalState().camera;
  }

  onTransformChanged(transform: Transform): void {
    this.transform = transform;
  }
}
