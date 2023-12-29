
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { Plane, Vector3 } from 'three';


// note your calling function needs to start with async
// it also auto centers

export async function loadModelAsync(path, customName, addShadows = true, receiveShadow = true){
  var result = await new GLTFLoader().loadAsync(path);
  var item = result.scene;
  result.scene.children[0].position.setScalar(0);
  // item.scale.setScalar(0.1);

  if (customName) item.name = customName;

  // model needs shadows
  if (addShadows) {
    item.traverse((item) => {
      if (item.isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
  }
  
  return item;

}
