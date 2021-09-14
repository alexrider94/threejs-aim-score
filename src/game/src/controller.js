class BasicController {
  constructor() {
    this._input = new BasicControllerInput();
    this._setMachine = new StateMachine();
  }
}

class PlayerController {
  constructor() {}
}

class BasicControllerInput {
  constructor() {
    this._init();
  }

  _init() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };

    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 87: //w
        this._keys.forward = true;
        break;
      case 65: //a
        this._keys.left = true;
        break;
      case 83: //s
        this._keys.backward = true;
        break;
      case 68: //d
        this._keys.right = true;
        break;
      case 32: //space
        this._keys.space = true;
        break;
      case 16: //shift
        this._keys.shift = true;
        break;
    }
  }

  _onKeyUp(event) {
    switch (event.keyCode) {
      case 87: //w
        this._keys.forward = false;
        break;
      case 65: //a
        this._keys.left = false;
        break;
      case 83: //s
        this._keys.backward = false;
        break;
      case 68: //d
        this._keys.right = false;
        break;
      case 32: //space
        this._keys.space = false;
        break;
      case 16: //shift
        this._keys.shift = false;
        break;
    }
  }
}

class StateMachine {
  constructor() {
    this._state = {};
    this._currentState = null;
  }

  _AddState(name, type) {
    this._state[name] = type;
  }

  SetState(name) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }

  Update(timeElapsed, input) {
    if (this._currentState) {
      this._currentState.Update(timeElapsed, input);
    }
  }
}

class PlayerFSM extends StateMachine {
  constructor(proxy) {
    super();
    this._proxy;
  }
}
