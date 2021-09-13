import * as THREE from 'three';
import '../style.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
  gltfLoader = new GLTFLoader();

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
    this.animate();
  }

  // keyDown = (event) => {
  //   this.keys[event.key] = true;
  // };

  // keyUp = (event) => {
  //   delete this.keys[event.key];
  // };

  controlMovement = () => {
    let moveSpeed = 0.05;

    if (this.keys['w']) {
      console.log('test');
      this.player.position.x -= Math.sin(this.player.rotation.y) * moveSpeed;
      this.player.position.z -= Math.cos(this.player.rotation.y) * moveSpeed;
    }
    if (this.keys['s']) {
      this.player.position.x += Math.sin(this.player.rotation.y) * moveSpeed;
      this.player.position.z += Math.cos(this.player.rotation.y) * moveSpeed;
    }

    if (this.keys['d']) {
      this.player.position.x += moveSpeed * Math.sin(this.player.rotation.y + Math.PI / 2);
      this.player.position.z += moveSpeed * Math.cos(this.player.rotation.y - Math.PI / 2);
    }
    if (this.keys['a']) {
      this.player.position.x -= moveSpeed * Math.sin(this.player.rotation.y + Math.PI / 2);
      this.player.position.z -= moveSpeed * Math.cos(this.player.rotation.y - Math.PI / 2);
    }
  };

  animate = () => {
    // this.controlMovement();
    requestAnimationFrame(this.animate);
    this._renderer.render(this._scene, this._camera);
  };

  /**
   * Setup Three js components
   * camera, gui
   */
  setUpThreeComponents = () => {
    this._camera = new THREE.PerspectiveCamera(75, this._size.width / this._size.height, 0.1, 1000);

    this._camera.position.x = 5;
    this._camera.position.z = 100;
    this._scene.add(this._camera);

    // this.player = new THREE.Object3D();
    // this.player.position.set(0, 0, 0);
    // this.player.add(this._camera);
    this.gltfLoader.load(
      '/assets/scene.gltf',
      (gltf) => {
        const root = gltf.scene;
        this._scene.add(root);
      },
      (event) => {
        console.log(event);
      },
      (error) => {
        console.log(error);
      }
    );

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this._scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, -1, 1);
    this._scene.add(light);

    this._renderer = new THREE.WebGLRenderer({
      canvas: this.$canvas,
      antialias: true,
    });

    this._renderer.setSize(this._size.width, this._size.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  /* get gl design */
  applyGraphic = () => {};
}

new Game();
