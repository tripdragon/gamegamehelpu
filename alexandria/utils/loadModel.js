
import { Box3, Vector3, Box3Helper } from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


import { store } from 'alexandria/store';
import { ImportedModel } from 'alexandria/primitives/importedModel.js';

// note you are calling a function that needs to start with async
// it also auto centers

export async function loadModelAsync({path, customName, addShadows = true, receiveShadow = true} ){
  var result = await new GLTFLoader().loadAsync(path);
  // #TODO: must solve some auto name thing here
  // #Code: nnnanananame38744 #
  console.warn("#TODO: must solve some auto name thing here");

  // has weird bug see cat model
  console.warn("#TODO: some weird missing object in array is missing, needs checking");
  const modelSwap = new ImportedModel({loaderResult:result, addShadows:addShadows, customName:customName});
  // debugger
  

  // #code: scene28475#
  modelSwap.matrixAutoUpdate = false;
  
  // dont rely on this here as its typical that the model will need to be resized after
  // modelSwap.computeLocalAndWorldBounds();
  
  return modelSwap;
  // return result.scene;

}
