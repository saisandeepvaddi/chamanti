import { mat4 } from 'gl-matrix';
import { Attribute, Camera, RenderObject, Uniform } from '..';
import { Material } from '../materials/Material';
import modelFragmentShader from '../shaders/modelFragment.glsl';
import modelVetexShader from '../shaders/modelVertex.glsl';
import { getGlobalState } from '../state/global';
import { Transform, Transformable } from '../transforms/Transform';
import Geometry from './Geometry';
export class MeshRenderer implements Transformable {
  geometry: Geometry;
  material: Material;
  transform: Transform;
  camera: Camera;
  _renderObject: RenderObject;
  constructor(geometry: Geometry, material: Material, transform: Transform) {
    this.geometry = geometry;
    this.material = material;
    this.transform = transform;
    this.camera = getGlobalState().camera;
    const attributes: Attribute[] = [
      {
        name: 'aPosition',
        data: this.geometry.vertices,
        size: 3,
        indices: this.geometry.indices,
      },
    ];
    const uniforms: Uniform[] = [
      {
        name: 'uViewMatrix',
        value: this.camera ? this.camera.getViewMatrix() : mat4.create(),
      },
      {
        name: 'uProjectionMatrix',
        value: this.camera ? this.camera.getProjectionMatrix() : mat4.create(),
      },
      {
        name: 'uModelMatrix',
        value: mat4.create(),
      },
    ];
    this._renderObject = new RenderObject(
      {
        name: 'MeshRenderer',
        vertexShader: modelVetexShader,
        fragmentShader: modelFragmentShader,
        attributes,
        uniforms,
        textures: [],
      },
      this.transform
    );
    this._renderObject.setup();
  }
  updateCamera(camera: Camera) {
    this.camera = camera;
    this._renderObject.updateUniform('uViewMatrix', camera.getViewMatrix());
    this._renderObject.updateUniform(
      'uProjectionMatrix',
      camera.getProjectionMatrix()
    );
  }
  onTransformChanged(transform: Transform): void {
    this.transform = transform;
    this._renderObject.onTransformChanged(transform);
  }
  render(_delta: number) {
    this._renderObject.updateUniform(
      'uViewMatrix',
      this.camera.getViewMatrix()
    );
    this._renderObject.updateUniform(
      'uProjectionMatrix',
      this.camera.getProjectionMatrix()
    );
    this._renderObject.draw();
  }
}
