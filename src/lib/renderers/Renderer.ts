import { Camera } from '..';
import { Scene } from '../scene/Scene';

export interface Renderer {
  gl: WebGL2RenderingContext;
  scene: Scene | null;
  setScene(scene: Scene): void;
  setCamera(camera: Camera): void;
  render(): void;
}
