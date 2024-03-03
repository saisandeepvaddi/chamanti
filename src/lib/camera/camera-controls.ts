import { DragGesture, WheelGesture } from '@use-gesture/vanilla';
import { vec3 } from 'gl-matrix';
import { Camera } from './Camera';

export class CameraControls {
  camera: Camera;
  spherical = {
    theta: 0,
    phi: Math.PI / 2,
    radius: 5,
  };
  canvas: HTMLCanvasElement;
  dragGesture: DragGesture;
  wheelGesture: WheelGesture;
  sensitivity = 0.005;
  autoUpdateCamera = false;
  center: vec3 = [0, 0, 0];
  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.spherical.radius = vec3.distance(this.camera.position, this.center);
    this.canvas = canvas;

    this.dragGesture = new DragGesture(canvas, ({ delta }) => {
      const [dx, dy] = delta;
      this.spherical.theta += dx * this.sensitivity;
      const newPhi = this.spherical.phi - dy * this.sensitivity;
      this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, newPhi));

      if (this.autoUpdateCamera) {
        this.updateCameraPosition();
      }
    });

    this.wheelGesture = new WheelGesture(canvas, ({ delta }) => {
      this.spherical.radius += delta[1] * this.sensitivity;
      this.spherical.radius = Math.max(1, Math.min(100, this.spherical.radius));
      if (this.autoUpdateCamera) {
        this.updateCameraPosition();
      }
    });

    this.updateCameraPosition();
  }

  setCenter(center: vec3) {
    this.center = center;
  }

  updateCameraPosition() {
    const { theta, phi, radius } = this.spherical;

    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    this.camera.setPosition(x, y, z);
    this.camera.lookAt(this.center);
  }
}
