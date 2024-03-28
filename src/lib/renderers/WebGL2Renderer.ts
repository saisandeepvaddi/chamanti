import { invariant } from '..';
import { Scene } from '../scene/Scene';
import { Renderer } from './Renderer';

export class WebGL2Renderer implements Renderer {
  gl: WebGL2RenderingContext;
  scene: Scene | null = null;
  constructor(canvas: HTMLCanvasElement) {
    console.log('WebGL2Renderer created.');
    const context = canvas.getContext('webgl2');
    invariant(!!context, 'WebGL2 not available in your browser.');
    this.gl = context;
  }
  setScene(scene: Scene) {
    this.scene = scene;
  }
  render(): void {
    console.log('Rendering scene with WebGL2Renderer.');
  }
}
