import * as THREE from 'three';

class Bullet {
  constructor() {}

  addBullet(scene, camera) {
    if (camera) {
      const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x222222 })
      );

      if (camera.position.y === 0) {
        camera.position.y = 10;
      }

      bullet.alive = true;
      bullet.position.z = -21;
      bullet.position.x = 2.8;
      bullet.position.y = -1.9;
      setTimeout(function () {
        bullet.position.z += 0.02;
        bullet.alive = false;
        camera.remove(bullet);
      }, 1000);
      console.log(scene);
      // camera.add(bullet);
      camera.add(bullet);
      scene.add(camera);
    }
  }
}

export default Bullet;