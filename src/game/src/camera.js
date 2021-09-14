class ThirdPersonCamera {
  _params = {};
  _camera = null;

  constructor(params) {
    this._params = params;
    this._camera = params.camera;
  }
}

export default ThirdPersonCamera;
