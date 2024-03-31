import { Attribute, Camera, RenderObject, Uniform, invariant } from '..';
import { Texture } from '../Texture';

import { Material } from '../materials/Material';
import { getGlobalState } from '../state/global';
import { Transform, Transformable } from '../transforms/Transform';
import Geometry from './Geometry';
import { Mesh } from './Mesh';
export class MeshRenderer implements Transformable {
  mesh: Mesh;
  transform: Transform;
  camera: Camera;
  _renderObject: RenderObject;
  attributes: Attribute[];
  geometry: Geometry;
  material: Material;
  constructor(mesh: Mesh) {
    this.mesh = mesh;
    this.geometry = this.mesh.geometry;
    this.material = this.mesh.material;
    this.transform = this.mesh.transform;
    this.camera = getGlobalState().camera;
    this.attributes = [
      {
        name: 'aPosition',
        data: this.geometry.vertices,
        size: 3,
        indices: this.geometry.indices,
      },
    ];
    if (this.geometry.textureCoords) {
      this.attributes.push({
        name: 'aTexCoord',
        data: this.geometry.textureCoords,
        size: 2,
      });
    }
    const uniforms: Uniform[] = this.material.uniforms;
    const textures: Texture[] = this.material.textures;
    invariant(
      !!this.mesh.material.vertexShader,
      'MeshRenderer requires a vertexShader'
    );
    invariant(
      !!this.mesh.material.fragmentShader,
      'MeshRenderer requires a fragmentShader'
    );
    this._renderObject = new RenderObject(
      {
        name: 'MeshRenderer',
        vertexShader: this.mesh.material.vertexShader,
        fragmentShader: this.mesh.material.fragmentShader,
        attributes: this.attributes,
        uniforms,
        textures,
      },
      this.transform
    );
    this.material._renderObject = this._renderObject;
    this._renderObject.setup();
  }

  onTransformChanged(transform: Transform): void {
    this.transform = transform;
    this._renderObject.onTransformChanged(transform);
  }
  render(_delta: number) {
    // this._renderObject.uniforms = this.material.uniforms;
    // this._renderObject.textures = this.material.textures;
    this._renderObject.draw();
  }
}
