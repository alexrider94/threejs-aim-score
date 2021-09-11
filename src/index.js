import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Main {
  _canvas = null;
  _scene = null;
  _size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  _camera = null;
  _renderer = null;
  _clock = new THREE.Clock();
  _controls = null;

  lastElapsedTime = 0;

  constructor() {
    this.setUp();
    this.tick();
  }

  tick = () => {
    const elapsedTime = this._clock.getElapsedTime();
    // const deltaTime = elapsedTime - this.lastElapsedTime;
    this.lastElapsedTime = elapsedTime;

    // Update controls
    this.controls.update();

    // Render
    this._renderer.render(this._scene, this._camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick);
  };

  setUp = function () {
    this._canvas = document.querySelector('canvas.app');
    this._scene = new THREE.Scene();

    window.addEventListener('resize', () => {
      // Save sizes
      this._size.width = window.innerWidth;
      this._size.height = window.innerHeight;

      // Update camera
      this._camera.aspect = this._size.width / this._size.height;
      this._camera.updateProjectionMatrix();

      // Update renderer
      this._renderer.setSize(this._size.width, this._size.height);
    });

    this._camera = new THREE.PerspectiveCamera(75, this._size.width / this._size.height, 0.1, 100);
    this._camera.position.x = 1;
    this._camera.position.y = 1;
    this._camera.position.z = 1;

    this._scene.add(this._camera);

    const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshNormalMaterial());

    this.controls = new OrbitControls(this._camera, this._canvas);
    this.controls.enableDamping = true;

    this._scene.add(cube);

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
    });
    this._renderer.setSize(this._size.width, this._size.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
}

new Main();
