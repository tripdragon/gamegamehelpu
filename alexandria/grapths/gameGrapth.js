
import { Group } from 'three';
import { CheapPool } from 'alexandria/utils/cheapPool.js';
import { ImportedModels } from './importedModels.js';
import { AnimationPool } from './animationPool.js';
import { SceneGrapth } from './sceneGrapth.js';
import { PlanningBoard } from './planningBoard.js';
import { Levels } from './levels.js';


import { TransformControls } from 'three/addons/controls/TransformControls.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { store } from 'alexandria/store';

export class SelectableItems extends CheapPool {
  constructor(){
    super();
  }
}

// #TODO: fix some of these and GameGrapth to be arrays instead
// #code: gaaame238 #
export class GameGrapth {
  transformWidget = null;
  pointerDownOnTransformWidget = false;

  constructor(props) {
    // Default Game Pipeline Settings
    this.timeSystem = false;
    this.physics = true;
    this.outOfBounds = 300;
    // Stuff
    this.camera = props.camera || null;
    this.scene = props.scene || null;
    this.renderer = props.renderer || null;
    this.domElement = props.domElement || null;
    this.cameraControls = {
      orbit:null,
      wasd:null,
      main:null
    }
    // this.controls = props.controls || null;
    this.animationPool = new AnimationPool();
    this.sceneGrapth = new SceneGrapth();
    this.planningBoard = new PlanningBoard();
    this.currentLevelMap = props.currentLevelMap || null; // upgrade to class
    this.levels = props.levels || new Levels({scene:props.scene});
    this.importedModels = props.importedModels || new ImportedModels();
    this.helpersGroup = props.helpersGroup;
    this.selectableItems = new SelectableItems();
    this.widgetsGroup = new Group();
    this.renderPool = new Map();
    this.physicsGroup = new Group();
  }

  setCameraControls(mode){
    if (mode === 'orbit') {
      this.cameraControls.main = this.cameraControls.orbit;
    }
  }

  buildCameraControls(){
    this.cameraControls.orbit = new OrbitControls( this.camera, this.domElement );
    this.setCameraControls('orbit');
  }

  registerRenderCallback(func) {
    this.renderPool.set(func, func);
    // Return unregister func
    return () => this.renderPool.delete(func);
  }

  buildPhysicsGroup() {
    this.scene.add(this.physicsGroup);
  }

  // @mode 'translate', 'rotate' and 'scale'
  buildTransformWidget(mode){

    // having all 3 in scene does not work by threejs design at the moment
    if (this.transformWidget) return;

    this.scene.add(this.widgetsGroup);

    var widget;

    this.transformWidget = new TransformControls( this.camera, this.domElement );
    this.transformWidget.store = store;
    // widget = this[mode+'Widget'] = new TransformControls( this.camera, this.domElement );

    this.transformWidget.mode = mode;
    this.widgetsGroup.add(this.transformWidget);

    this.transformWidget.setSize(0.7);


    this.transformWidget.addEventsHandleCamera();

    // const _this = this;
    //
    // // widget.addEventListener( 'pointerdown', function ( event ) {
    // widget.addEventListener( 'mouseDown', function ( event ) {
    //   // _o.controls.enabled = ! event.value;
    //   // debugger
    //   // debugger
    //   _this.controls.enabled = false;
    //   _this.pointerDownOnTransformWidget = true;
    // });
    //
    // widget.addEventListener( 'mouseUp', function ( event ) {
    //   // this.controls.enabled = ! event.value;
    //   _this.controls.enabled = true;
    //   _this.pointerDownOnTransformWidget = false;
    // });
    //
    // // widget.addEventListener( 'dragging-changed', function ( event ) {
    // widget.addEventListener( 'change', function ( event ) {
    //   // this.controls.enabled = ! event.value;
    //   // this.transformWidget.object.updateMatrix();
    //   // console.log('object', this.controls.object);
    //   // console.log('¿¿¿¿¿');
    //   if (this.object) {
    //     this.object.updateMatrix();
    //     // if (this.object.boxHelperPointer) {
    //     //   this.object.boxHelperPointer.updateMatrix();
    //     // }
    //   }
    //   else{
    //     _this.controls.enabled = true;
    //     _this.pointerDownOnTransformWidget = false;
    //   }
    // });
    //
    //
  }
}

// others
