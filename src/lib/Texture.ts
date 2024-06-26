import { GLContext, invariant } from '.';
import { USE_DIFFUSE_MAP, USE_NORMAL_MAP } from './shaders/define_constants';
import {
  DIFFUSE_MAP_UNIFORM,
  NORMAL_MAP_UNIFORM,
} from './shaders/uniform_constants';
import { getGlobalState } from './state/global';
import { isPowerOf2 } from './utils/math';

export type TextureType = 'diffuse' | 'normal';

export const textureUniforms: Record<TextureType, string> = {
  diffuse: DIFFUSE_MAP_UNIFORM,
  normal: NORMAL_MAP_UNIFORM,
};

export const textureDefines: Record<TextureType, string> = {
  diffuse: USE_DIFFUSE_MAP,
  normal: USE_NORMAL_MAP,
};

export class Texture {
  gl: GLContext;
  image: HTMLImageElement | null = null;
  texture: WebGLTexture;
  isLoaded: boolean = false;
  name: string = textureUniforms['diffuse'];
  uniformLocation: WebGLUniformLocation | null = null;
  textureUpdated: boolean = false;
  src: string = '';
  type: TextureType = 'diffuse';
  constructor(type: TextureType = 'diffuse', src = '') {
    this.gl = getGlobalState().gl;
    this.name = textureUniforms[type];
    this.type = type;
    this.src = src;
    const texture = this.gl.createTexture();
    invariant(!!texture, 'WebGL createTexture failed');
    this.texture = texture;
  }

  loadDefaultTexture() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    const initPixel = new Uint8Array([255, 0, 0, 255]);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      initPixel
    );
    this.isLoaded = true;
    this.textureUpdated = true;
    return this;
  }

  async loadImage(): Promise<Texture> {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          image
        );
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          this.gl.generateMipmap(this.gl.TEXTURE_2D);

          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.LINEAR_MIPMAP_LINEAR
          );
        } else {
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_S,
            this.gl.CLAMP_TO_EDGE
          );
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_T,
            this.gl.CLAMP_TO_EDGE
          );
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.LINEAR
          );
        }

        this.isLoaded = true;
        this.textureUpdated = true;
      };

      image.src = this.src;
      resolve(this);
    });
  }
}
