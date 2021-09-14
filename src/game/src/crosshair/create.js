import * as THREE from 'three';

class Aim {
  x = 0.05;
  y = 0.05;
  crosshairPercentX = 50;
  crosshairPercentY = 50;
  crosshair = null;

  constructor(camera) {
    const material = new THREE.LineBasicMaterial({ color: 0xaaffaa });
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([0, this.y, 0, 0, -this.y, 0, 0, 0, 0, this.x, 0, 0, -this.x, 0, 0]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    console.log(geometry);
    this.crosshair = new THREE.Line(geometry, material);
    console.log(this.crosshair);
    const crosshairPositionX = (this.crosshairPercentX / 100) * 2 - 1;
    const crosshairPositionY = (this.crosshairPercentY / 100) * 2 - 1;

    this.crosshair.position.x = crosshairPositionX * camera.aspect;
    this.crosshair.position.y = crosshairPositionY;

    this.crosshair.position.z = -3;
  }
}

export default Aim;
