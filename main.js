import './basestyles.scss';

// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box3, Vector3, Box3Helper } from 'three';

import { store } from 'alexandria/store';
import Initializers from 'initializers/index';

import { initGameLoop } from 'logics/gameLoop';

import { fish } from 'narf';

import { patchObject3D_CM } from 'alexandria/patches/patchObject3D';
import { patchTransformControls } from 'alexandria/patches/patchTransformControls';

import { loadModelAsync } from 'alexandria/utils/loadModel';
import { randomInRange } from 'alexandria/utils/stuff';

// import { GetPositionOfRaycasterFromFloor, GetMousePositionToScreen } from 'alexandria/mousetools/mouseScreenTools.js';

// import { Notlilgui } from './notlilgui/notlilgui.js';

// import { Editor } from 'logics/editor';
import { ToolsShelfEditor } from 'alexandria/tools/toolsShelfEditor';
//
// import { VolumeRect } from 'alexandria/primitives/volumeRect';
//
// import GUI from 'lil-gui';

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

  patchTransformControls();

  await Initializers(store);

  // Kickoff game loop!
  initGameLoop();

  console.log('store', store);

  fish();

  // loadereee3894();

  // attachLeftShelf();

  store.setState({
    toolsShelfEditor: new ToolsShelfEditor()
  });

  window.Vector3 = Vector3;
  window.Box3 = Box3;
  window.Box3Helper = Box3Helper;
  window.AltBox3Helper = AltBox3Helper;
  // console.log('vectorA', vectorA);

  // forcing optimisations
  // #code: scene28475#
  store.state.game.scene.traverse((item) => {
    item.matrixAutoUpdate = false;
    if (item.isNotStatic) {
      item.matrixAutoUpdate = true;
    }
  });
  // EXCEPT widgets!!
  // store.state.game.widgetsGroup.traverse((item) => {
  //   item.matrixAutoUpdate = true;
  // });
  store.state.game.widgetsGroup.setAutoMatrixAll(false, true);
};

init();
