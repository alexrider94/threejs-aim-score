import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { setUpModel } from './setup';
import { getAnimation, animate } from './animation';

async function loadPlayer() {
  const Gloader = new GLTFLoader();
  const playerData = await Gloader.loadAsync('../../assets/models/player/scene.gltf');

  const model = setUpModel(playerData);
  const animations = getAnimation(playerData);

  // animate(model, animations, 'Reload');
  // animate(model, animations, 'Shoot');
  return { model, animations };
}

export { loadPlayer };
