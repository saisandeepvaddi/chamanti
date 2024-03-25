import { mat4, quat, vec3 } from 'gl-matrix';
import { beforeEach, describe, expect, test } from 'vitest';
import { Transform } from './Transform';

describe('Transform', () => {
  let transform: Transform;

  beforeEach(() => {
    transform = new Transform();
  });

  test('should update position correctly', () => {
    const newPosition = { x: 1, y: 2, z: 3 };
    transform.setPosition({ x: 0, y: 0, z: 0 });
    transform.updatePositionBy(newPosition);
    const actualPos = transform.position;
    const expectedPos = vec3.fromValues(1, 2, 3);
    expect(vec3.equals(actualPos, expectedPos)).toBe(true);
    const actualMatrix = transform.localMatrix;
    const expectedMatrix = mat4.fromTranslation(mat4.create(), expectedPos);
    expect(mat4.equals(actualMatrix, expectedMatrix)).toBe(true);
  });

  test('should update rotation correctly', () => {
    const newRotation = { x: 1, y: 2, z: 3 };
    transform.setRotation({ x: 0, y: 0, z: 0 });
    transform.updateRotationBy(newRotation);
    expect(vec3.equals(transform.rotation, vec3.fromValues(1, 2, 3))).toBe(
      true
    );
    expect(
      mat4.equals(
        transform.localMatrix,
        mat4.fromQuat(mat4.create(), quat.fromEuler(quat.create(), 1, 2, 3))
      )
    ).toBe(true);
  });

  test('should update scale correctly', () => {
    const newScale = { x: 2, y: 2, z: 2 };
    transform.setScale({ x: 1, y: 1, z: 1 });
    transform.updateScaleBy(newScale);
    expect(vec3.equals(transform.scale, vec3.fromValues(3, 3, 3))).toBe(true);
    expect(
      mat4.equals(
        transform.localMatrix,
        mat4.fromScaling(mat4.create(), vec3.fromValues(3, 3, 3))
      )
    ).toBe(true);
  });

  test('should update position, rotation, and scale correctly', () => {
    const newPosition = { x: 1, y: 2, z: 3 };
    const newRotation = { x: 1, y: 2, z: 3 };
    const newScale = { x: 1, y: 1, z: 1 };
    transform.setPosition({ x: 0, y: 0, z: 0 });
    transform.updateBy({
      position: newPosition,
      rotation: newRotation,
      scale: newScale,
    });
    const actualPos = transform.position;
    const expectedPos = vec3.fromValues(1, 2, 3);
    expect(vec3.equals(actualPos, expectedPos)).toBe(true);
    expect(vec3.equals(transform.rotation, vec3.fromValues(1, 2, 3))).toBe(
      true
    );

    expect(vec3.equals(transform.scale, vec3.fromValues(2, 2, 2))).toBe(true);
    const actualMatrix = transform.localMatrix;
    const expectedMatrix = mat4.fromRotationTranslationScale(
      mat4.create(),
      quat.fromEuler(quat.create(), 1, 2, 3),
      expectedPos,
      vec3.fromValues(2, 2, 2)
    );
    expect(mat4.equals(actualMatrix, expectedMatrix)).toBe(true);
  });
});
