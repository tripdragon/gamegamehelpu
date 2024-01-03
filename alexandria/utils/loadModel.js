
import { Box3, Vector3, Box3Helper } from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


import { store } from 'alexandria/store';

// note you are calling a function that needs to start with async
// it also auto centers

export async function loadModelAsync({path, customName, addShadows = true, receiveShadow = true} ){
  var result = await new GLTFLoader().loadAsync(path);
  var item = result.scene;
  result.scene.children[0].position.setScalar(0);
  // item.scale.setScalar(0.1);
  
  // #TODO: must solve some auto name thing here
  // #Code: nnnanananame38744 #
  console.warn("#TODO: must solve some auto name thing here");

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

  // #code: scene28475#
  item.matrixAutoUpdate = false;
  
  // dont rely on this here as its typical that the model will need to be resized after
  // item.computeLocalAndWorldBounds();
  
  return item;

}
