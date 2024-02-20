import { GLContext, invariant } from '.';
import { isPowerOf2 } from './utils/math';

export class Texture {
  context: GLContext;
  image: HTMLImageElement | null = null;
  texture: WebGLTexture;
  isLoaded: boolean = false;
  uniformName: string = 'uTexture';
  uniformLocation: WebGLUniformLocation | null = null;
  textureUpdated: boolean = false;
  constructor(context: GLContext) {
    this.context = context;
    const texture = this.context.createTexture();
    invariant(!!texture, 'WebGL createTexture failed');
    this.texture = texture;
    this.load = this.load.bind(this);
    this.update = this.update.bind(this);
  }
  async load(url: string) {
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    const image = new Image();
    const initPixel = new Uint8Array([0, 0, 0, 255]);
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

    image.onload = () => {
      this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
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
          this.context.LINEAR
        );
      }
      this.isLoaded = true;
      this.textureUpdated = true;
    };

    image.src = url;
    return this.texture;
  }

  update() {
    invariant(!!this.texture, `Texture ${this.uniformName} not loaded`);
    if (this.textureUpdated) {
      this.context.activeTexture(this.context.TEXTURE0);
      this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
      this.context.uniform1i(this.uniformLocation, 0);
      this.textureUpdated = false;
    }
  }
}
