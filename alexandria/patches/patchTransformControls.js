

// these commands are so common we just need them on the class
/*

transformWidget = new TransformControls( camera, domElement );
transformWidget.store = store;

transformWidget.mode = "translate"; // scale rotate
transformWidget.setSize(0.7);

transformWidget.addEventsHandleCamera();

widgetsGroup.add(transformWidget);

*/


import { TransformControls } from 'three/addons/controls/TransformControls.js';

export function patchTransformControls(){

  // this will have to be updated at some point
  // TransformControls.prototype.cameraControls = null;
  TransformControls.prototype.store = null;
  // TransformControls.prototype.pointerDownOnTransformWidget = false;


  TransformControls.prototype.addEventsHandleCamera = function(){

    // should be pointerEvent but the plugin uses mouse naming
    // widget.addEventListener( 'pointerdown', function ( event ) {

    const _this = this;

    this.addEventListener( 'mouseDown', function ( event ) {
      // _o.controls.enabled = ! event.value;
      // debugger
      // debugger
      // _this.cameraControls.enabled = false;
      _this.store.state.game.cameraControls.main.enabled = false;
      _this.store.state.game.pointerDownOnTransformWidget = true;
    });

    this.addEventListener( 'mouseUp', function ( event ) {
      // this.controls.enabled = ! event.value;
      _this.store.state.game.cameraControls.main.enabled = true;
      _this.store.state.game.pointerDownOnTransformWidget = false;
    });

    // widget.addEventListener( 'dragging-changed', function ( event ) {
    this.addEventListener( 'change', function ( event ) {
      // this.controls.enabled = ! event.value;
      // this.transformWidget.object.updateMatrix();
      // console.log("object", this.controls.object);
      // console.log("¿¿¿¿¿");

      if(_this.store.state.game.pointerDownOnTransformWidget === true){
        if (_this.object) {
          _this.object.updateMatrix();
        }
      }

      if (_this.object) {
        // _this.object.updateMatrix();
        // if (this.object.boxHelperPointer) {
        //   this.object.boxHelperPointer.updateMatrix();
        // }
      }
      else{
        _this.store.state.game.cameraControls.main.enabled = true;
        _this.store.state.game.pointerDownOnTransformWidget = false;
      }

    });


  }




}
