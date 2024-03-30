import { v4 as uuid } from 'uuid';
import { Transform, Transformable } from '../transforms/Transform';

export abstract class Component implements Transformable {
  id = uuid();
  abstract name: string;
  abstract onTransformChanged(transform: Transform): void;
  isRenderable = false;
}
