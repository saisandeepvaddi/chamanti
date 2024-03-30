import { mat4, quat, vec3 } from 'gl-matrix';

export interface Transformable {
  onTransformChanged(transform: Transform): void;
}
export class Transform {
  position: vec3 = vec3.create();
  localPosition: vec3 = vec3.create();
  rotation: vec3 = vec3.create();
  quaternion: quat = quat.fromEuler(quat.create(), 0, 0, 0);
  localRotation: vec3 = vec3.create();
  scale: vec3 = vec3.fromValues(1, 1, 1);
  localScale: vec3 = vec3.create();
  localMatrix: mat4 = mat4.create();
  worldMatrix: mat4 = mat4.create();
  parent: Transform | null = null;
  private observers: Transformable[] = [];

  constructor(observer?: Transformable) {
    this.updateWorldMatrix();
    if (observer) {
      this.addObserver(observer);
    }
  }

  addObserver(observer: Transformable): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    for (const observer of this.observers) {
      observer.onTransformChanged(this);
    }
  }

  setPosition({
    x = 0,
    y = 0,
    z = 0,
  }: { x?: number; y?: number; z?: number } = {}): Transform {
    this.position[0] = x;
    this.position[1] = y;
    this.position[2] = z;

    mat4.multiply(
      this.localMatrix,
      mat4.fromTranslation(mat4.create(), this.position),
      this.localMatrix
    );

    this.updateWorldMatrix();
    this.notifyObservers();
    return this;
  }
  updatePositionBy({
    x = 0,
    y = 0,
    z = 0,
  }: { x?: number; y?: number; z?: number } = {}): Transform {
    this.position[0] += x;
    this.position[1] += y;
    this.position[2] += z;
    mat4.translate(this.localMatrix, this.localMatrix, this.position);
    this.updateWorldMatrix();
    this.notifyObservers();
    return this;
  }

  setRotation({
    x = 0,
    y = 0,
    z = 0,
  }: { x?: number; y?: number; z?: number } = {}): Transform {
    this.rotation[0] = x;
    this.rotation[1] = y;
    this.rotation[2] = z;
    quat.fromEuler(
      this.quaternion,
      this.rotation[0],
      this.rotation[1],
      this.rotation[2]
    );

    mat4.multiply(
      this.localMatrix,
      mat4.fromQuat(mat4.create(), this.quaternion),
      this.localMatrix
    );

    this.updateWorldMatrix();
    this.notifyObservers();
    return this;
  }

  updateRotationBy({
    x = 0,
    y = 0,
    z = 0,
  }: { x?: number; y?: number; z?: number } = {}): Transform {
    this.rotation[0] += x;
    this.rotation[1] += y;
    this.rotation[2] += z;
    quat.fromEuler(
      this.quaternion,
      this.rotation[0],
      this.rotation[1],
      this.rotation[2]
    );

    // update matrix with latest rotation
    mat4.multiply(
      this.localMatrix,
      mat4.fromQuat(mat4.create(), this.quaternion),
      this.localMatrix
    );

    this.updateWorldMatrix();
    this.notifyObservers();
    return this;
  }

  setScale({
    x = 1,
    y = 1,
    z = 1,
  }: { x?: number; y?: number; z?: number } = {}): Transform {
    this.scale[0] = x;
    this.scale[1] = y;
    this.scale[2] = z;

    mat4.multiply(
      this.localMatrix,
      mat4.fromScaling(mat4.create(), this.scale),
      this.localMatrix
    );

    this.updateWorldMatrix();
    this.notifyObservers();
    return this;
  }

  updateScaleBy({
    x = 1,
    y = 1,
    z = 1,
  }: { x?: number; y?: number; z?: number } = {}): Transform {
    this.scale[0] += x;
    this.scale[1] += y;
    this.scale[2] += z;
    mat4.scale(this.localMatrix, this.localMatrix, this.scale);
    this.updateWorldMatrix();
    this.notifyObservers();
    return this;
  }

  // Set all three position, rotation, and scale at once
  set({
    position = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 },
    scale = { x: 1, y: 1, z: 1 },
  }: {
    position?: { x?: number; y?: number; z?: number };
    rotation?: { x?: number; y?: number; z?: number };
    scale?: { x?: number; y?: number; z?: number };
  } = {}): Transform {
    this.position[0] = position.x ?? 0;
    this.position[1] = position.y ?? 0;
    this.position[2] = position.z ?? 0;

    this.rotation[0] = rotation.x ?? 0;
    this.rotation[1] = rotation.y ?? 0;
    this.rotation[2] = rotation.z ?? 0;

    quat.fromEuler(
      this.quaternion,
      this.rotation[0],
      this.rotation[1],
      this.rotation[2]
    );

    this.scale[0] = scale.x ?? 1;
    this.scale[1] = scale.y ?? 1;
    this.scale[2] = scale.z ?? 1;

    mat4.fromRotationTranslationScale(
      this.localMatrix,
      this.quaternion,
      this.position,
      this.scale
    );
    this.notifyObservers();

    return this;
  }

  // Update all three position, rotation, and scale at once
  updateBy({
    position = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 },
    scale = { x: 1, y: 1, z: 1 },
  }: {
    position?: { x?: number; y?: number; z?: number };
    rotation?: { x?: number; y?: number; z?: number };
    scale?: { x?: number; y?: number; z?: number };
  } = {}): Transform {
    this.position[0] += position.x ?? 0;
    this.position[1] += position.y ?? 0;
    this.position[2] += position.z ?? 0;

    this.rotation[0] += rotation.x ?? 0;
    this.rotation[1] += rotation.y ?? 0;
    this.rotation[2] += rotation.z ?? 0;

    quat.fromEuler(
      this.quaternion,
      this.rotation[0],
      this.rotation[1],
      this.rotation[2]
    );

    this.scale[0] += scale.x ?? 0;
    this.scale[1] += scale.y ?? 0;
    this.scale[2] += scale.z ?? 0;

    mat4.fromRotationTranslationScale(
      this.localMatrix,
      this.quaternion,
      this.position,
      this.scale
    );
    this.notifyObservers();

    return this;
  }

  private updateWorldMatrix(): void {
    if (this.parent) {
      mat4.multiply(
        this.worldMatrix,
        this.parent.worldMatrix,
        this.localMatrix
      );
    } else {
      mat4.copy(this.worldMatrix, this.localMatrix);
    }
  }
}
