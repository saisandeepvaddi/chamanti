import { mat4, vec3 } from 'gl-matrix';
import { Node } from '../scene/Node';

export class Camera extends Node {
  projectionMatrix: mat4;
  viewMatrix: mat4;
  position: vec3 = [0, 0, 0];
  up: vec3 = [0, 1, 0];
  constructor(fov: number, aspect: number, near: number, far: number) {
    super('Camera');
    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    mat4.perspective(this.projectionMatrix, fov, aspect, near, far);
  }

  lookAt(target: vec3) {
    mat4.lookAt(this.viewMatrix, this.position, target, this.up);
  }

  setPosition(x: number, y: number, z: number) {
    this.position = [x, y, z];
  }

  getViewMatrix() {
    return this.viewMatrix;
  }

  getProjectionMatrix() {
    return this.projectionMatrix;
  }
}
