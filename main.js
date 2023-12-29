// import './basestyles.css';

// import './style-3d-fix.css';

import { store } from 'alexandria/store';
import Initializers from 'alexandria/initializers/index';

import { renderLoop } from 'logics/renderLoop';

import { fish } from 'narf';

import { patchObject3D_CM } from 'alexandria/initializers/patchObject3D';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Plane, Vector3 } from 'three';
import { loadModelAsync } from 'alexandria/utils/loadModel';
import { randomInRange } from 'alexandria/utils/stuff';

// import {fakeStore as _b} from 'logics/fakeStore';
import {GetPositionOfRaycasterFromFloor, GetMousePositionToScreen} from 'alexandria/mousetools/mouseScreenTools.js';

import {Notlilgui} from './notlilgui/notlilgui.js';

const init = async () => {

  patchObject3D_CM();

  await Initializers(store);
  
  // Kickoff render loop!
  renderLoop(0, store);

  console.log('store', store);

  fish();
  
  loadereee3894();
  
  attachLeftShelf();
  
};

init();


async function loadereee3894() {

  var piece1 = await loadModelAsync("./models/trees_mwoie_1.glb");
  piece1.scale.setScalar(0.1);
  piece1.position.x = randomInRange(-4,4);
  piece1.position.z = randomInRange(-4,4);
  

  store.state.game.scene.add(piece1);
  store.state.game.importedModels.add(piece1);
  
  // _b.geoPath1.addPiece(piece1, "corner", "bottomRight");
  
  const floorPlane = new Plane(new Vector3(0,1,0), 0);
  
  const targetVecOfPlane = new Vector3();
  
  store.state.game.domElement.addEventListener("pointerdown", onPointerDown324);
  
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


  var piece2 = await loadModelAsync("./models/bench1.glb");
  // piece2.scale.setScalar(0.1);
  store.state.game.scene.add(piece2);
  store.state.game.importedModels.add(piece2);
  piece2.scale.setScalar(0.2);
  
}


function attachLeftShelf() {
  let gg = new Notlilgui();
  gg.attach();
  gg.addItem({imageurl:"./icons/tree_NFT_NFT_NFT_upon.png"});
  gg.addItem({imageurl:"./icons/bench_NFT_apples_upon.png"});
  // gg.addItem();
  // gg.addItem();
  // gg.addItem();
  // gg.addItem();
  // for (var i = 0; i < 40; i++) {
  //   gg.addItem();
  // }
  
}
