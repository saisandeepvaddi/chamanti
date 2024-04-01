import { GLContext, invariant } from '.';
import { getGlobalState } from './state/global';
import { isPowerOf2 } from './utils/math';

export enum TextureType {
  BASE_COLOR,
  NORMAL,
}

export const textureNames: Record<TextureType, string> = {
  [TextureType.BASE_COLOR]: 'uBaseTexture',
  [TextureType.NORMAL]: 'uNormalTexture',
};

export class Texture {
  gl: GLContext;
  image: HTMLImageElement | null = null;
  texture: WebGLTexture;
  isLoaded: boolean = false;
  name: string = textureNames[TextureType.BASE_COLOR];
  uniformLocation: WebGLUniformLocation | null = null;
  textureUpdated: boolean = false;
  src: string = '';
  type: TextureType = TextureType.BASE_COLOR;
  constructor(src: string = '', type = TextureType.BASE_COLOR) {
    this.gl = getGlobalState().gl;
    this.name = textureNames[type];
    this.type = type;
    this.src = src;
    const texture = this.gl.createTexture();
    invariant(!!texture, 'WebGL createTexture failed');
    this.texture = texture;
  }

  loadDefaultTexture() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    const initPixel = new Uint8Array([128, 128, 128, 255]);
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

  async loadImage() {
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
      resolve(this.texture);
    });
  }

  setURL(url: string) {
    this.src = url;
    return this.loadImage();
  }

  bindTexture() {
    invariant(!!this.texture, `Texture ${this.name} not loaded`);
    if (this.textureUpdated) {
      this.gl.activeTexture(this.gl.TEXTURE0 + this.type);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.uniform1i(this.uniformLocation, this.type);
      this.textureUpdated = false;
    }
  }
}
