import { animate } from './animation';

class BasicController {
  constructor(velocity, model, animations) {
    this._input = new BasicControllerInput(velocity, model, animations);
  }
}

class BasicControllerInput {
  velocity = null;
  model = null;
  animations = null;

  constructor(velocity, model, animations) {
    this.velocity = velocity;
    this.model = model;
    this.animations = animations;
    this._init();
  }

  _init() {
    this._keys = {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      canJump: false,
    };

    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    document.addEventListener('click', () => this._onClick());
  }

  _onClick() {
    animate(this.model, this.animations, 'Shoot');
  }

  _onKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this._keys.moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        this._keys.moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        this._keys.moveBackward = true;
        break;
      case 'KeyR':
        animate(this.model, this.animations, 'Reload');
        break;
      case 'ArrowRight':
      case 'KeyD':
        this._keys.moveRight = true;
        break;

      case 'Space':
        if (this._keys.canJump === true) this.velocity.y += 350;
        this._keys.canJump = false;
        break;
    }
  }

  _onKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this._keys.moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        this._keys.moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        this._keys.moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        this._keys.moveRight = false;
        break;
    }
  }
}

export default BasicController;
