import { GLContext, invariant } from '.';
import { getGlobalState } from './state/global';
import { isPowerOf2 } from './utils/math';

export class Texture {
  gl: GLContext;
  image: HTMLImageElement | null = null;
  texture: WebGLTexture;
  isLoaded: boolean = false;
  name: string = 'uTexture';
  uniformLocation: WebGLUniformLocation | null = null;
  textureUpdated: boolean = false;
  textureURL: string = '';
  constructor(name: string = 'uTexture', textureURL: string = '') {
    this.gl = getGlobalState().gl;
    this.name = name;
    this.textureURL = textureURL;
    const texture = this.gl.createTexture();
    invariant(!!texture, 'WebGL createTexture failed');
    this.texture = texture;
    this.loadDefaultTexture();
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
  }

  async loadImage() {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
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
            this.gl.NEAREST
          );
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MAG_FILTER,
            this.gl.NEAREST
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
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.uniform1i(this.uniformLocation, 0);
      this.textureUpdated = false;
    }
  }
}
