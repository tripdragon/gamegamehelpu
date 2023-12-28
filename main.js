// import './basestyles.css';

// import './style-3d-fix.css';

import { store } from 'alexandria/store';
import Initializers from 'alexandria/initializers/index';

import { renderLoop } from 'logics/renderLoop';

import { fish } from 'narf';

import { patchObject3D_CM } from 'alexandria/initializers/patchObject3D';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Plane, Vector3 } from 'three';

// import {fakeStore as _b} from 'logics/fakeStore';
import {GetPositionOfRaycasterFromFloor, GetMousePositionToScreen} from 'alexandria/mousetools/mouseScreenTools.js';

const init = async () => {

  patchObject3D_CM();

  await Initializers(store);
  
  // Kickoff render loop!
  renderLoop(0, store);

  console.log('store', store);

  fish();
  
  loadereee3894();
  
};

init();


async function loadereee3894() {
  
  var result = await new GLTFLoader().loadAsync("./models/trees_mwoie_1.glb");
  var piece1 = result.scene;
  piece1.scale.setScalar(0.1);
  piece1.name = "trees_mwoie_1";
  
  // model needs shadows
  piece1.traverse((item) => {
    if (item.isMesh) {
      item.castShadow = true;
      item.receiveShadow = true;
    }
  });
  

  store.state.game.scene.add(piece1);
  store.state.game.importedModels.add(piece1);
  
  // _b.geoPath1.addPiece(piece1, "corner", "bottomRight");
  
  const floorPlane = new Plane(new Vector3(0,1,0), 0);
  
  const targetVecOfPlane = new Vector3();
  
  window.addEventListener("pointerdown", onPointerDown324);
  
  function onPointerDown324(ev){
    console.log(ev);
    let piece2 = piece1.clone();
    let _o = store.state.game;
    // _o.scene.add(piece2);
    _o.currentLevelMap.add(piece2);
    piece2.position.x = Math.random() * 4;
    piece2.position.z = Math.random() * 4;
    _o.planningBoard.add(piece2);
    
    GetPositionOfRaycasterFromFloor({domElement:_o.renderer.domElement, ev:ev, camera: _o.camera, floorPlane:floorPlane, vector3in: targetVecOfPlane});
    // _o.onConsole.log("isdownBbb", "isdownBbb");
    piece2.position.copy(targetVecOfPlane);

  }


  // window.cachuplevel = cachuplevel;


  
  
}
