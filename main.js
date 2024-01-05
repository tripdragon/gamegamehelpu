import './basestyles.scss';

import { store } from 'alexandria/store';
import Initializers from 'alexandria/initializers/index';

import { renderLoop } from 'logics/renderLoop';

import { fish } from 'narf';

import { patchObject3D_CM } from 'alexandria/initializers/patchObject3D';

// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box3, Vector3, Box3Helper } from 'three';
import { loadModelAsync } from 'alexandria/utils/loadModel';
import { randomInRange } from 'alexandria/utils/stuff';


// import { GetPositionOfRaycasterFromFloor, GetMousePositionToScreen } from 'alexandria/mousetools/mouseScreenTools.js';

// import { Notlilgui } from './notlilgui/notlilgui.js';

// import {Editor} from 'logics/editor';
import {ToolsShelfEditor} from 'alexandria/tools/toolsShelfEditor';

import { VolumeRect } from 'alexandria/primitives/volumeRect';

import GUI from 'lil-gui';



class AltBox3Helper extends Box3Helper{
  constructor( box, color = 0xffff00 ) {
    super(box, color)
  }

  updateMatrixWorld( force ) {

		const box = this.box;

		if ( box.isEmpty() ) return;

		box.getCenter( this.position );

		box.getSize( this.scale );

		this.scale.multiplyScalar( 0.5 );

		super.updateMatrixWorld( force );

	}

}




const init = async () => {

  patchObject3D_CM();

  await Initializers(store);

  // Kickoff render loop!
  renderLoop();

  console.log('store', store);

  fish();

  loadereee3894();

  // attachLeftShelf();


  store.setState({
    toolsShelfEditor: new ToolsShelfEditor()
  });

  window.Vector3 = Vector3;
  window.Box3 = Box3;
  window.Box3Helper = Box3Helper;
  window.AltBox3Helper = AltBox3Helper;
  // console.log("vectorA", vectorA);


  // forcing optimisations
  // #code: scene28475#
  store.state.game.scene.traverse((item) => {
    item.matrixAutoUpdate = false;
  });
  // EXCEPT widgets!!
  // store.state.game.widgetsGroup.traverse((item) => {
  //   item.matrixAutoUpdate = true;
  // });
  store.state.game.widgetsGroup.setAutoMatrixAll(false, true);

  buildLilGui(store.state.game);
  
  
  let gg = new VolumeRect();
  store.state.game.scene.add(gg);
  gg.position.y = 1.4;
  window.vol = gg;
  console.log(vol);
  

};

init();


async function loadereee3894() {

  var piece1 = await loadModelAsync({path:'./models/trees_mwoie_1.glb'});
  piece1.scale.setScalar(0.1);
  piece1.position.x = randomInRange(-4,4);
  piece1.position.z = randomInRange(-4,4);
  piece1.updateMatrix();
  // #Code: nnnanananame38744 #
  // we need some name auto system here
  // temp name for now
  piece1.name = 'trees_mwoie_1';
  store.state.game.scene.add(piece1);
  store.state.game.importedModels.add(piece1);
  store.state.game.selectableItems.add(piece1);

// debugger
  // need to update box after a transform like scale
  // piece1.boxHelperPointer?.box.setFromObject(piece1);
  // piece1.refreshBoxHelper();
  // piece1.moreBuild_CM({targetGroup:store.state.game.helpersGroup});




  var piece2 = await loadModelAsync({path:'./models/bench1.glb'});
  // piece2.scale.setScalar(0.1);
  store.state.game.scene.add(piece2);
  store.state.game.importedModels.add(piece2);
  piece2.scale.setScalar(0.2);
  piece2.updateMatrix();
  piece2.name = 'bench1';

  store.state.game.selectableItems.add(piece2);
  // piece2.refreshBoxHelper();
  // piece2.moreBuild_CM({targetGroup:store.state.game.helpersGroup});




  const piece3 = await loadModelAsync({path:'./models/poly-cat-w-hat.glb'});
  // piece2.scale.setScalar(0.1);
  store.state.game.scene.add(piece3);
  store.state.game.importedModels.add(piece3);
  piece3.scale.setScalar(0.02);
  piece3.updateMatrix();
  piece3.name = 'poly-cat';

  store.state.game.selectableItems.add(piece3);
  // piece3.moreBuild_CM({targetGroup:store.state.game.helpersGroup});


}


function buildLilGui(gameConfig){

  // const _o = this.store.state.game;
  // const _o = store.state.game;

  const gui = new GUI({width: 140 });
  // gui.add( document, 'fish' );

  const obj = {
  	// myBoolean: true,
  	// myString: 'lil-gui',
  	// myNumber: 1,
  	widgetTranslate: function() { gameConfig.transformWidget.mode = "translate" },
  	widgetRotate: function() { gameConfig.transformWidget.mode = "rotate" },
  	widgetScale: function() { gameConfig.transformWidget.mode = "scale" }
  }

  // gui.add( obj, 'myBoolean' ); 	// checkbox
  // gui.add( obj, 'myString' ); 	// text field
  // gui.add( obj, 'myNumber' ); 	// number field
  gui.add( obj, 'widgetTranslate' ); 	// button
  gui.add( obj, 'widgetRotate' ); 	// button
  gui.add( obj, 'widgetScale' ); 	// button

}


//
//
// function attachLeftShelf() {
//   let gg = new Notlilgui();
//   gg.attach();
//   gg.addItem({imageurl:"./icons/cursor_a_NFT_cash_mices.png"});
//   gg.addItem({imageurl:"./icons/tree_NFT_NFT_NFT_upon.png"});
//   gg.addItem({imageurl:"./icons/bench_NFT_apples_upon.png"});
//   // gg.addItem();
//   // gg.addItem();
//   // gg.addItem();
//   // gg.addItem();
//   // for (var i = 0; i < 40; i++) {
//   //   gg.addItem();
//   // }
//
// }
