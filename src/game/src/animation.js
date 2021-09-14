import * as THREE from 'three';

export function getAnimation(data) {
  return data.animations;
}

export function animate(model, animations, actionType) {
  if (model && animations) {
    let clock = new THREE.Clock();
    const mixer = new THREE.AnimationMixer(model);
    const clip = THREE.AnimationClip.findByName(animations, actionType);

    const action = mixer.clipAction(clip);
    action.clampWhenFinished = true;

    if (actionType === 'Shoot') {
      action.time = 3.8;
    }
    action.setLoop(THREE.LoopOnce);
    action.play();

    const tick = () => {
      let delta = clock.getDelta();
      // clock is an instance of THREE.Clock
      if (action.paused) return;
      if (mixer) mixer.update(delta);
      requestAnimationFrame(tick);
    };

    tick();
  }
}
