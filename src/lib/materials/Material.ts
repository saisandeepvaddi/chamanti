import { mat4 } from 'gl-matrix';
import { Camera, RenderObject, Uniform } from '..';
import { Mesh } from '../meshes/Mesh';
import { Component } from '../scene/Component';
import modelFragmentShader from '../shaders/modelFragment.glsl';
import modelVetexShader from '../shaders/modelVertex.glsl';
import { getGlobalState } from '../state/global';
import { Transform } from '../transforms/Transform';
export class Material extends Component {
  name: string;
  _renderObject: RenderObject;
  transform: Transform;
  mesh: Mesh | null = null;
  camera: Camera | null = null;
  constructor(name: string = 'Material') {
    super();
    this.name = name;
    this.transform = new Transform();
    this.camera = getGlobalState().camera;
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
        name: 'Material',
        vertexShader: modelVetexShader,
        fragmentShader: modelFragmentShader,
        attributes: [],
        uniforms,
        textures: [],
      },
      this.transform
    );
    this._renderObject.setup();
  }
  setMesh(mesh: Mesh) {
    this.mesh = mesh;
    // Get vertex and normal data from mesh and update render object

    this._renderObject.addAttribute({
      name: 'aPosition',
      data: mesh.vertices,
      size: 3,
      indices: mesh.indices,
    });
  }
  setCamera(camera: Camera) {
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
  render() {
    if (this.mesh === null) {
      return;
    }
    this._renderObject.draw();
  }
}
