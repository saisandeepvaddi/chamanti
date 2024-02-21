import { mat4, vec3 } from 'gl-matrix';

export class Camera {
  projectionMatrix: mat4;
  viewMatrix: mat4;
  position: vec3 = [0, 0, 0];
  constructor(fov: number, aspect: number, near: number, far: number) {
    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    mat4.perspective(this.projectionMatrix, fov, aspect, near, far);

    this.lookAt = this.lookAt.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.getViewMatrix = this.getViewMatrix.bind(this);
    this.getProjectionMatrix = this.getProjectionMatrix.bind(this);
  }

  lookAt(target: vec3, up: vec3) {
    mat4.lookAt(this.viewMatrix, this.position, target, up);
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
