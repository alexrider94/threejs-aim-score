import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';

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
  _mouse = {
    x: undefined,
    y: undefined,
  };
  _raycaster = null;
  _plane = null;
  _world = {
    plane: {
      width: 300,
      height: 300,
      widthSegments: 70,
      heightSegments: 70,
    },
  };
  _frame = 0;

  constructor() {
    this.setUp();
    // this.initGUI();
    this.tick();
  }

  initGUI = () => {
    const gui = new dat.GUI();
    gui.add(this._world.plane, 'width', 1, 50).onChange(this.generatePlane);
    gui.add(this._world.plane, 'height', 1, 50).onChange(this.generatePlane);
    gui.add(this._world.plane, 'widthSegments', 1, 20).onChange(this.generatePlane);
    gui.add(this._world.plane, 'heightSegments', 1, 20).onChange(this.generatePlane);
  };

  generatePlane = () => {
    this._plane.geometry.dispose();
    this._plane.geometry = new THREE.PlaneGeometry(
      this._world.plane.width,
      this._world.plane.height,
      this._world.plane.widthSegments,
      this._world.plane.heightSegments
    );

    const { array } = this._plane.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      array[i + 2] = z + Math.random();
    }

    const colors = [];
    for (let i = 0; i < this._plane.geometry.attributes.position.count; ++i) {
      colors.push(0, 0.19, 0.4);
    }

    this._plane.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  };

  tick = () => {
    window.requestAnimationFrame(this.tick);
    // Update controls
    this._controls.update();
    this._frame += 0.01;
    // Render
    this._renderer.render(this._scene, this._camera);
    this._raycaster.setFromCamera(this._mouse, this._camera);
    const { array, originalPosition, randomValues } = this._plane.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
      array[i] = originalPosition[i] + Math.cos(this._frame + randomValues[i]) * 0.0025;

      array[i + 1] = originalPosition[i + 1] + Math.sin(this._frame + randomValues[i + 1]) * 0.0025;
    }

    this._plane.geometry.attributes.position.needsUpdate = true;

    const intersects = this._raycaster.intersectObject(this._plane);
    // Call tick again on the next frame
    if (intersects.length > 0) {
      const { color } = intersects[0].object.geometry.attributes;
      // vertice 1
      color.setX(intersects[0].face.a, 0.1);
      color.setY(intersects[0].face.a, 0.5);
      color.setZ(intersects[0].face.a, 1);

      // vertice 2
      color.setX(intersects[0].face.b, 0.1);
      color.setY(intersects[0].face.b, 0.5);
      color.setZ(intersects[0].face.b, 1);

      // vertice 3
      color.setX(intersects[0].face.c, 0.1);
      color.setY(intersects[0].face.c, 0.5);
      color.setZ(intersects[0].face.c, 1);

      intersects[0].object.geometry.attributes.color.needsUpdate = true;

      const initialColor = {
        r: 0,
        g: 0.19,
        b: 0.4,
      };

      const hoverColor = {
        r: 0.1,
        g: 0.5,
        b: 1,
      };

      gsap.to(hoverColor, {
        r: initialColor.r,
        g: initialColor.g,
        b: initialColor.b,
        duration: 1,
        onUpdate: () => {
          // vertice 1
          color.setX(intersects[0].face.a, hoverColor.r);
          color.setY(intersects[0].face.a, hoverColor.g);
          color.setZ(intersects[0].face.a, hoverColor.b);

          // vertice 2
          color.setX(intersects[0].face.b, hoverColor.r);
          color.setY(intersects[0].face.b, hoverColor.g);
          color.setZ(intersects[0].face.b, hoverColor.b);

          // vertice 3
          color.setX(intersects[0].face.c, hoverColor.r);
          color.setY(intersects[0].face.c, hoverColor.g);
          color.setZ(intersects[0].face.c, hoverColor.b);
          color.needsUpdate = true;
        },
      });
    }
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

    //Set up Camera
    this._camera = new THREE.PerspectiveCamera(75, this._size.width / this._size.height, 0.1, 1000);
    // this._camera.position.x = 1;
    // this._camera.position.y = 1;
    this._camera.position.z = 50;

    this._scene.add(this._camera);

    //Set up Control
    this._controls = new OrbitControls(this._camera, this._canvas);
    this._controls.enableDamping = true;

    //Set up Meshes
    this._plane = new THREE.Mesh(
      new THREE.PlaneGeometry(
        this._world.plane.width,
        this._world.plane.height,
        this._world.plane.widthSegments,
        this._world.plane.heightSegments
      ),
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        flatShading: THREE.FlatShading,
        vertexColors: true,
      })
    );

    this._scene.add(this._plane);
    const { array } = this._plane.geometry.attributes.position;
    const randomValues = [];
    for (let i = 0; i < array.length; ++i) {
      if (i % 3 === 0) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];

        array[i] = x + (Math.random() - 0.5) * 3;
        array[i + 1] = y + (Math.random() - 0.5) * 3;
        array[i + 2] = z + Math.random() - 0.5 * 5;
      }

      randomValues.push(Math.random() - 0.5);
    }

    this._plane.geometry.attributes.position.originalPosition = this._plane.geometry.attributes.position.array;
    this._plane.geometry.attributes.position.randomValues = randomValues;

    const colors = [];
    for (let i = 0; i < this._plane.geometry.attributes.position.count; ++i) {
      colors.push(0, 0.19, 0.4);
    }

    this._plane.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    //Set up Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, -1, 1);

    this._scene.add(light);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(0, 0, -1);
    this._scene.add(backLight);

    this._raycaster = new THREE.Raycaster();

    //Set Renderer
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
    });

    this._renderer.setSize(this._size.width, this._size.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener('mousemove', (event) => {
      this._mouse.x = (event.clientX / this._size.width) * 2 - 1;
      this._mouse.y = -(event.clientY / this._size.height) * 2 + 1;
    });
  };
}

new Main();
