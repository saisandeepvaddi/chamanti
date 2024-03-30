import { OldRenderer } from './OldRenderer';
import { Renderer } from './renderers/Renderer';

export type ChamantiOptions = {
  renderer?: OldRenderer;
  webglVersion?: 1 | 2;
};

export class Chamanti {
  renderer: Renderer | null = null;
  canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement, renderer?: Renderer) {
    this.canvas = canvas;
  }
  setRenderer(renderer: Renderer) {
    this.renderer = renderer;
  }
}
