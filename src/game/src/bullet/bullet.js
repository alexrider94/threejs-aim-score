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
      bullet.position.set(2.8, -1.9, -21);
      setTimeout(function () {
        bullet.position.z += 0.02;
        bullet.alive = false;
        camera.remove(bullet);
      }, 1000);
      console.log(camera.rotation);
      bullet.velocity = new THREE.Vector3(0, 0, -Math.cos(camera.rotation.y));

      // camera.add(bullet);
      camera.add(bullet);
      scene.add(camera);

      return bullet;
    }
  }
}

export default Bullet;
