import { GLContext, invariant } from '.';
import { getGlobalState } from './state/global';
import { isPowerOf2 } from './utils/math';

export class Texture {
  context: GLContext;
  image: HTMLImageElement | null = null;
  texture: WebGLTexture;
  isLoaded: boolean = false;
  name: string = 'uTexture';
  uniformLocation: WebGLUniformLocation | null = null;
  textureUpdated: boolean = false;
  textureURL: string = '';
  constructor(name: string = 'uTexture', textureURL: string = '') {
    this.context = getGlobalState().gl;
    this.name = name;
    this.textureURL = textureURL;
    const texture = this.context.createTexture();
    invariant(!!texture, 'WebGL createTexture failed');
    this.texture = texture;
    this.loadDefaultTexture();
  }

  loadDefaultTexture() {
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    const initPixel = new Uint8Array([128, 128, 128, 255]);
    this.context.texImage2D(
      this.context.TEXTURE_2D,
      0,
      this.context.RGBA,
      1,
      1,
      0,
      this.context.RGBA,
      this.context.UNSIGNED_BYTE,
      initPixel
    );
  }

  async loadImage() {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
        // this.context.pixelStorei(this.context.UNPACK_FLIP_Y_WEBGL, 1);
        this.context.texImage2D(
          this.context.TEXTURE_2D,
          0,
          this.context.RGBA,
          this.context.RGBA,
          this.context.UNSIGNED_BYTE,
          image
        );
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          this.context.generateMipmap(this.context.TEXTURE_2D);
          this.context.texParameteri(
            this.context.TEXTURE_2D,
            this.context.TEXTURE_MIN_FILTER,
            this.context.LINEAR_MIPMAP_LINEAR
          );
        } else {
          this.context.texParameteri(
            this.context.TEXTURE_2D,
            this.context.TEXTURE_WRAP_S,
            this.context.CLAMP_TO_EDGE
          );
          this.context.texParameteri(
            this.context.TEXTURE_2D,
            this.context.TEXTURE_WRAP_T,
            this.context.CLAMP_TO_EDGE
          );
          this.context.texParameteri(
            this.context.TEXTURE_2D,
            this.context.TEXTURE_MIN_FILTER,
            this.context.NEAREST
          );
          this.context.texParameteri(
            this.context.TEXTURE_2D,
            this.context.TEXTURE_MAG_FILTER,
            this.context.NEAREST
          );
        }

        this.isLoaded = true;
        this.textureUpdated = true;
      };

      image.src = this.textureURL;
      resolve(this.texture);
    });
  }

  setURL(url: string) {
    this.textureURL = url;
    return this.loadImage();
  }

  update() {
    invariant(!!this.texture, `Texture ${this.name} not loaded`);
    if (this.textureUpdated) {
      this.context.activeTexture(this.context.TEXTURE0);
      this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
      this.context.uniform1i(this.uniformLocation, 0);
      this.textureUpdated = false;
    }
  }
}
