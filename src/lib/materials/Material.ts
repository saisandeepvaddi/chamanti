import { mat4 } from 'gl-matrix';
import { Camera, RenderObject, Uniform, UniformValue, invariant } from '..';
import { Texture } from '../Texture';
import { Component } from '../scene/Component';
import modelFragmentShader from '../shaders/modelFragment.glsl';
import modelVetexShader from '../shaders/modelVertex.glsl';
import { getGlobalState } from '../state/global';
import { Transform } from '../transforms/Transform';
export class Material extends Component {
  name: string;
  transform: Transform;
  camera: Camera;
  uniforms: Uniform[] = [];
  vertexShader: string | null = modelVetexShader;
  fragmentShader: string | null = modelFragmentShader;
  textures: Texture[] = [];
  _renderObject: RenderObject | null = null;
  constructor(name: string = 'Material') {
    super();
    this.name = name;
    this.transform = new Transform();
    this.camera = getGlobalState().camera;

    this.uniforms = [
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
    this.textures = [new Texture()];
  }

  addUniform(name: string, value: UniformValue) {
    invariant(
      !!this._renderObject,
      'Material must be attached to a RenderObject'
    );
    // check if uniform with name already exists
    const uniform = this.uniforms.find((u) => u.name === name);
    invariant(!uniform, `Uniform with name ${name} already exists`);
    this.uniforms.push({ name, value });
    this._renderObject.uniforms.push({ name, value });
    this._renderObject.setUniform(name, value);
  }

  updateUniform(name: string, value: UniformValue) {
    invariant(
      !!this._renderObject,
      'Material must be attached to a RenderObject'
    );
    const uniform = this.uniforms.find((u) => u.name === name);
    invariant(!!uniform, `Uniform ${name} not found`);
    if (uniform) {
      uniform.value = value;
    }
    this._renderObject.updateUniform(name, value);
  }

  updateTexture(texture: Texture) {
    invariant(
      !!this._renderObject,
      'Material must be attached to a RenderObject'
    );
    let tex = this.textures.find((t) => t.name === texture.name);
    if (tex) {
      tex = texture;
      if (tex.textureURL) {
        tex.loadImage().then(() => {
          if (tex) {
            this._renderObject?.updateTexture(tex);
          }
        });
      } else {
        this._renderObject.updateTexture(tex);
      }
    } else {
      this.textures.push(texture);
      this._renderObject.textures.push(texture);
      this._renderObject.setupTexture(texture);
    }
  }

  onTransformChanged(transform: Transform): void {
    this.transform = transform;
  }
}
