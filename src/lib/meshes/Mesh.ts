import { Component } from '../scene/Component';
import { Transform } from '../transforms/Transform';

export class Mesh extends Component {
  vertices: number[];
  indices: number[];
  normals?: number[];
  textureCoords?: number[];
  name: string = 'Mesh';
  constructor(
    vertices: number[] = [],
    indices: number[] = [],
    normals?: number[],
    textureCoords?: number[]
  ) {
    super();
    this.vertices = vertices;
    this.indices = indices;
    this.normals = normals;
    this.textureCoords = textureCoords;
  }
  setName(name: string) {
    this.name = name;
  }

  onTransformChanged(transform: Transform): void {
    console.log('Mesh.onTransformChanged not implemented.');
  }
}
