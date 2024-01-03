
import { Box3, Vector3, Box3Helper } from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


import { store } from 'alexandria/store';

// note you are calling a function that needs to start with async
// it also auto centers

export async function loadModelAsync({path, customName, addShadows = true, receiveShadow = true, addBoxHelper = false} ){
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
  
  if(addBoxHelper){
    // item.updateMatrix()
    // item.updateMatrixWorld();
    const box = new Box3();
    box.setFromObject(item)

    // const helper = new Box3Helper( box, 0xffff00 );
    const helper = new Box3Helper( box, 0x0000ff );
    item.boxHelperPointer = helper;
    store.state.game.helpersGroup.add(helper);
    // window.mm = helper
  }
  
  // #code: scene28475#
  item.matrixAutoUpdate = false;
  
  return item;

}
