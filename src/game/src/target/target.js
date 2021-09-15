import * as THREE from 'three';

class Target {
  _size = 100;

  constructor() {}

  addTargetRandomly(scene) {
    for (let index = 0; index < this._size; ++index) {
      const geometry = new THREE.BoxGeometry(25, 25, 5);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

      const newTarget = new THREE.Mesh(geometry, material);
      newTarget.position.set(Math.random() * 1000, Math.random() * 100, Math.random() * 100);
      scene.add(newTarget);
    }
  }
}

export default Target;
