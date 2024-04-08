import { mat3, mat4, vec4 } from 'gl-matrix';
import { v4 as uuidv4 } from 'uuid';
import { Camera, RenderObject, Uniform, UniformValue, invariant } from '..';
import { Texture, TextureType, textureDefines } from '../Texture';
import { Component } from '../scene/Component';
import { SHADER_TYPE, Shader } from '../shaders/Shader';
import {
  BASIC_COLOR_UNIFORM,
  MODEL_MATRIX_UNIFORM,
  NORMAL_MATRIX_UNIFORM,
  PROJECTION_MATRIX_UNIFORM,
  VIEW_MATRIX_UNIFORM,
} from '../shaders/uniform_constants';
import { getGlobalState } from '../state/global';
import { Transform } from '../transforms/Transform';
import modelFragmentShader from './modelFragment.glsl';
import modelVetexShader from './modelVertex.glsl';

export type MaterialOptions = {
  name?: string;
  color?: vec4;
  vertexShader?: string;
  fragmentShader?: string;
  textures?: Map<TextureType, Texture | null>;
};
export class Material extends Component {
  id: string;
  name: string;
  transform: Transform;
  camera: Camera;
  uniforms: Uniform[] = [];
  vertexShader: Shader;
  fragmentShader: Shader;
  private vertexShaderSource: string;
  private fragmentShaderSource: string;
  textures: Map<TextureType, Texture | null>;
  _renderObject: RenderObject | null = null;
  modelMatrix: mat4 = mat4.create();
  normalMatrix: mat3 = mat3.create();
  color: vec4 = vec4.fromValues(0.5, 0.5, 0.5, 1.0);
  vertexDefines: string[] = [];
  fragmentDefines: string[] = [];
  constructor(options: MaterialOptions = {}) {
    super();
    this.id = uuidv4();
    this.name = options.name ?? 'Material_' + this.id;
    this.color = options.color ?? this.color;
    this.vertexShaderSource = options.vertexShader ?? modelVetexShader;
    this.fragmentShaderSource = options.fragmentShader ?? modelFragmentShader;
    this.vertexShader = new Shader(
      SHADER_TYPE.VERTEX,
      this.vertexShaderSource,
      this.vertexDefines
    );
    this.fragmentShader = new Shader(
      SHADER_TYPE.FRAGMENT,
      this.fragmentShaderSource,
      this.fragmentDefines
    );
    this.transform = new Transform();
    this.camera = getGlobalState().camera;

    this.uniforms = [
      {
        name: VIEW_MATRIX_UNIFORM,
        value: this.camera ? this.camera.getViewMatrix() : mat4.create(),
      },
      {
        name: PROJECTION_MATRIX_UNIFORM,
        value: this.camera ? this.camera.getProjectionMatrix() : mat4.create(),
      },
      {
        name: MODEL_MATRIX_UNIFORM,
        value: this.modelMatrix,
      },
      {
        name: NORMAL_MATRIX_UNIFORM,
        value: this.normalMatrix,
      },
      {
        name: BASIC_COLOR_UNIFORM,
        value: this.color,
      },
    ];
    this.textures = new Map<TextureType, Texture | null>();
  }

  setColor(color: vec4) {
    this.color = color;
    this.updateUniform(BASIC_COLOR_UNIFORM, color);
  }

  addDiffuseTexture(src: string) {
    const texture = new Texture('diffuse', src);
    this.textures.set('diffuse', texture);
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
    Promise.all(
      Array.from(this.textures.values()).map((t) => t?.loadImage())
    ).then((textures) => {
      // update their defines
      this.fragmentDefines = [];
      (textures ?? []).forEach((t) => {
        if (t) {
          this.fragmentDefines.push(textureDefines[t.type]);
        }
      });

      this.vertexShader = new Shader(
        SHADER_TYPE.VERTEX,
        this.vertexShaderSource,
        this.vertexDefines
      );

      this.fragmentShader = new Shader(
        SHADER_TYPE.FRAGMENT,
        this.fragmentShaderSource,
        this.fragmentDefines
      );

      this._renderObject?.refreshProgramWithNewShaders(
        this.vertexShader.getShaderSource(),
        this.fragmentShader.getShaderSource()
      );
    });
  }

  onTransformChanged(transform: Transform): void {
    this.transform = transform;
  }
}
