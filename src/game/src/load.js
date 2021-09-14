import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { setUpModel } from './setup';
import { getAnimation } from './animation';
async function loadPlayer() {
  const Gloader = new GLTFLoader();
  const playerData = await Gloader.loadAsync('../../assets/models/player/scene.gltf');

  const model = setUpModel(playerData);
  const animations = getAnimation(playerData);
  console.log(animations);
  return { model, animations };
}

export { loadPlayer };
