import * as THREE from 'three';

class Main {
  _canvas = null;
  _scene = null;
  _size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  _camera = null;

  constructor() {
    setUp();
  }

  setUp = function () {
    this._canvas = document.querySelector('canvas.app');
    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera(75, this._sizes.width / this._sizes.height, 0.1, 100);
    this._camera.position.x = 1;
    this._camera.position.y = 1;
    this._camera.position.z = 1;

    _scene.add(this._camera);
  };
}

const init = Main();
init();
