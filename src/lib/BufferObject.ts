import { Attribute, Uniform } from '.';

export class BufferObject {
  name: string;
  attributes: Attribute[] | null = null;
  uniforms: Uniform[] | null = null;
  constructor(name: string) {
    this.name = name;
  }
}
