import { DragGesture, WheelGesture } from '@use-gesture/vanilla';
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

  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
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

    this.updateCameraPosition = this.updateCameraPosition.bind(this);

    this.updateCameraPosition();
  }

  updateCameraPosition() {
    const { theta, phi, radius } = this.spherical;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    this.camera.setPosition(x, y, z);
    this.camera.lookAt([0, 0, 0], [0, 1, 0]);
  }
}