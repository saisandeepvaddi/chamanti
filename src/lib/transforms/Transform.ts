import { mat4, quat, vec3 } from 'gl-matrix';

export class Transform {
  position: vec3 = vec3.create();
  localPosition: vec3 = vec3.create();
  rotation: vec3 = vec3.create();
  quaternion: quat = quat.create();
  localRotation: vec3 = vec3.create();
  scale: vec3 = vec3.create();
  localScale: vec3 = vec3.create();
  localMatrix: mat4 = mat4.create();
  worldMatrix: mat4 = mat4.create();
  parent: Transform | null = null;
  setPosition({
    x = 0,
    y = 0,
    z = 0,
  }: { x?: number; y?: number; z?: number } = {}): Transform {
    this.position[0] = x;
    this.position[1] = y;
    this.position[2] = z;
    mat4.fromTranslation(this.localMatrix, this.position);
    this.updateWorldMatrix();
    return this;
  }
  updatePosition({
    x = 0,
    y = 0,
    z = 0,
  }: { x?: number; y?: number; z?: number } = {}): Transform {
    this.position[0] += x;
    this.position[1] += y;
    this.position[2] += z;
    mat4.fromTranslation(this.localMatrix, this.position);
    this.updateWorldMatrix();
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
    mat4.fromQuat(this.localMatrix, this.quaternion);
    this.updateWorldMatrix();
    return this;
  }

  updateRotation({
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
    mat4.fromQuat(this.localMatrix, this.quaternion);
    this.updateWorldMatrix();
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
    mat4.fromScaling(this.localMatrix, this.scale);
    this.updateWorldMatrix();
    return this;
  }

  updateScale({
    x = 1,
    y = 1,
    z = 1,
  }: { x?: number; y?: number; z?: number } = {}): Transform {
    this.scale[0] += x;
    this.scale[1] += y;
    this.scale[2] += z;
    mat4.fromScaling(this.localMatrix, this.scale);
    this.updateWorldMatrix();
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

    return this;
  }

  // Update all three position, rotation, and scale at once
  update({
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

    this.scale[0] += scale.x ?? 0;
    this.scale[1] += scale.y ?? 0;
    this.scale[2] += scale.z ?? 0;

    mat4.fromRotationTranslationScale(
      this.localMatrix,
      this.quaternion,
      this.position,
      this.scale
    );

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
