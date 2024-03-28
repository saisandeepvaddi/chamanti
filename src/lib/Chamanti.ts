import { OldRenderer } from './OldRenderer';
import { Renderer } from './renderers/Renderer';
import { WebGL2Renderer } from './renderers/WebGL2Renderer';

export type ChamantiOptions = {
  renderer?: OldRenderer;
  webglVersion?: 1 | 2;
};

export class Chamanti {
  renderer: Renderer;
  canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement, renderer?: Renderer) {
    this.canvas = canvas;
    this.renderer = renderer ?? new WebGL2Renderer(this.canvas);
  }
  setRenderer(renderer: Renderer) {
    this.renderer = renderer;
  }
}
