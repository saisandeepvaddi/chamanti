import { mat4 } from 'gl-matrix';
import { Camera, RenderObject, Uniform, UniformValue, invariant } from '..';
import { Texture, TextureType } from '../Texture';
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
  textures: Map<TextureType, Texture | null>;
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
    this.textures = new Map();
    this.textures.set('baseColor', new Texture().loadDefaultTexture());
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
    this.textures.set(texture.type, texture);
    this._renderObject.textures.set(texture.type, texture);
    this._renderObject.setupTexture(texture);
    texture.loadImage().then(() => {
      this._renderObject?.updateTextures();
    });
  }

  updateTextures(textureMaps: Record<TextureType, Texture | null>) {
    invariant(
      !!this._renderObject,
      'Material must be attached to a RenderObject'
    );
    this.textures = new Map(Object.entries(textureMaps)) as unknown as Map<
      TextureType,
      Texture | null
    >;
    this._renderObject.textures = this.textures;
    this._renderObject.setupTextures();
    Promise.all(
      Array.from(this.textures.values()).map((t) => t?.loadImage())
    ).then(() => {
      this._renderObject?.updateTextures();
    });
  }

  onTransformChanged(transform: Transform): void {
    this.transform = transform;
  }
}
