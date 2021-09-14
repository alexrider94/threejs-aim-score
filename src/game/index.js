import * as THREE from 'three';
import '../style.css';
import { loadPlayer } from './src/load';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import Aim from './src/crosshair/create';
import BasicController from './src/controller';

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
  _direction = new THREE.Vector3();
  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
  controls = null;
  prevTime = performance.now();
  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
  movement = new BasicController(this.velocity);
  mixer = null;
  clock = new THREE.Clock();
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

    window.addEventListener('click', () => {
      this.controls.lock();
    });

    this.setUpThreeComponents();
    this.initLoad();
    this.animate();
  }

  initLoad = async () => {
    this._scene.background = new THREE.Color(0xffffff);
    let vertex = new THREE.Vector3();
    const color = new THREE.Color();
    const { model, animations } = await loadPlayer();
    this.movement = new BasicController(this.velocity, model, animations);
    model.position.set(0, -160, -50);

    /* rotate player model */
    model.rotation.z = 3.1;

    /* player arms and gun added to camera position */
    this._camera.add(model);

    const aimBox = new Aim(this._camera);
    this._camera.add(aimBox.crosshair);

    this.controls = new PointerLockControls(this._camera, document.body);
    this._scene.add(this.controls.getObject());

    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);
    let position = floorGeometry.attributes.position;

    for (let i = 0, l = position.count; i < l; i++) {
      vertex.fromBufferAttribute(position, i);

      vertex.x += Math.random() * 20 - 10;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 20 - 10;

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

    position = floorGeometry.attributes.position;
    const colorsFloor = [];

    for (let i = 0, l = position.count; i < l; i++) {
      color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      colorsFloor.push(color.r, color.g, color.b);
    }

    floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsFloor, 3));

    const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -50;
    this._scene.add(floor);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    const time = performance.now();
    if (this.controls && this.controls.isLocked === true) {
      this.raycaster.ray.origin.copy(this.controls.getObject().position);
      this.raycaster.ray.origin.y -= 10;

      // const intersections = this.raycaster.intersect(objects);

      // const onObject = intersections.length > 0;

      const delta = (time - this.prevTime) / 1000;

      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;

      this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      const movement = this.movement._input._keys;

      this.direction.z = Number(movement.moveForward) - Number(movement.moveBackward);
      this.direction.x = Number(movement.moveRight) - Number(movement.moveLeft);
      this.direction.normalize(); // this ensures consistent movements in all directions

      if (movement.moveForward || movement.moveBackward) this.velocity.z -= this.direction.z * 1400.0 * delta;
      if (movement.moveLeft || movement.moveRight) this.velocity.x -= this.direction.x * 1000.0 * delta;

      // if (onObject === true) {
      //   velocity.y = Math.max(0, velocity.y);
      //   canJump = true;
      // }

      this.controls.moveRight(-this.velocity.x * delta);
      this.controls.moveForward(-this.velocity.z * delta);

      this.controls.getObject().position.y += this.velocity.y * delta; // new behavior

      if (this.controls.getObject().position.y < 10) {
        this.velocity.y = 0;
        this.controls.getObject().position.y = 10;

        movement.canJump = true;
      }
    }

    this.prevTime = time;
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
    light.position.set(0, 0, 500);
    this._scene.add(light);

    //set up renderer
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
