import * as THREE from 'three';
import '../style.css';
import { loadPlayer } from './src/load';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Aim from './src/crosshair/create';

class Game {
  player = null;
  $canvas = document.querySelector('.game');
  _scene = new THREE.Scene();
  _renderer = null;
  _camera = null;
  _size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  _key = {};
  _planet = null;
  _control = null;

  constructor() {
    // document.onkeydown = this.keyDown;
    // document.onkeyup = this.keyUp;
    window.addEventListener('resize', () => {
      this._size.width = window.innerWidth;
      this._size.height = window.innerHeight;

      // Update camera
      this._camera.aspect = this._size.width / this._size.height;
      this._camera.updateProjectionMatrix();

      // Update renderer
      this._renderer.setSize(this._size.width, this._size.height);
    });

    this.setUpThreeComponents();
    this.initLoad();
    this.animate();
  }

  initLoad = async () => {
    const { model } = await loadPlayer();
    model.position.set(0, -160, -50);

    /* rotate player model */
    model.rotation.z = 3.1;

    /* player arms and gun added to camera position */
    this._camera.add(model);

    const aimBox = new Aim(this._camera);
    this._camera.add(aimBox.crosshair);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this._control.update();
    this._renderer.render(this._scene, this._camera);
  };

  /**
   * Setup Three js components
   * camera, gui
   */
  setUpThreeComponents = () => {
    this._camera = new THREE.PerspectiveCamera(75, this._size.width / this._size.height, 0.1, 1000);

    //set up camera
    this._camera.position.x = 0;
    this._camera.position.z = 200;
    this._scene.add(this._camera);

    //set up light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 100);
    this._scene.add(light);

    //set up renderer
    this._renderer = new THREE.WebGLRenderer({
      canvas: this.$canvas,
      antialias: true,
    });

    this._renderer.setSize(this._size.width, this._size.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this._control = new OrbitControls(this._camera, this._renderer.domElement);
  };

  /* get gl design */
  applyGraphic = () => {};
}

new Game();
