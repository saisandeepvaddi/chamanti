import { v4 as uuid } from 'uuid';
import { Transform } from '../transforms/Transform';

export abstract class Component {
  id = uuid();
  abstract name: string;
  abstract onTransformChanged(transform: Transform): void;
}
