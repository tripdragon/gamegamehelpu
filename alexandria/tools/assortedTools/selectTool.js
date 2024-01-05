

// var selectTool = new SelectTool(this.system);


import { GetPositionOfRaycasterFromFloor, GetMousePositionToScreen } from 'alexandria/mousetools/mouseScreenTools.js';

import { Raycaster, Vector2 } from 'three';

import { Tool } from "../tool.js";

import { quickDrawLine } from "alexandria/utils/quickDrawLine.js";
import { quickDrawBall } from "alexandria/utils/quickDrawBall.js";
// window.quickDrawLine = quickDrawLine;

export class SelectTool extends Tool {
  
  raycaster = new Raycaster();


  mPointerDown = new Vector2();
  pointer = new Vector2();
  

  constructor({store,domElement, system, name = "SelectTool", displayName = "Select Tool"} = {}){
    super({store, domElement, system, name, displayName});
  }
  
  // 
  // modes = {
  //   mousing : "mousing",
  //   // canDrag : "canDrag",
  //   // canDraw : "canDraw"
  // }
  // 
  // mode = this.modes.mousing;
  //
  
  intersects = [];
  
  skipRaycast = false;
  
  start(){
    super.start();
  }
  
  update(){
    this.mouseSelecting();
    this.pointerMoving();
  }

  selected = null;
  // selectedList = new CheapCache(); do this later
  select(item){
    this.selected = item;
    item.select();
  }
  deselect(item){
    if(item){
      this.selected = null;
      item.ondeselect();
    }
  }
  
  
  pointerDown(ev){
    
    let _o = this.store.state.game;
    
    if (_o.pointerDownOnTransformWidget) {
      return;
    }
    
    this.isMouseDown = true;
    // if(this.selectedObject !== null && this.selectedObject.moveyThingTool){
    //   // this.selectedObject.moveyThingTool.pointerDown(this.data);
    // }
    // console.log("select down");
    
    // sdklvfmdfgmdfgh
    
    // need to have saved box onto model
    // see nifftyshoes and the react game
    // otherwise you can do a live box3 and then intersect box3 instead
    // somewhere theres exaustion
    
    GetMousePositionToScreen(ev.clientX, ev.clientY, _o.domElement,  this.mPointerDown);
    // this.mPointerDown.set(ev.clientX, ev.clientY);
    
    // this.pointer.set(ev.clientX, ev.clientY);
    this.raycaster.setFromCamera( this.mPointerDown, _o.camera );

    // quickDrawLine( this.raycaster.ray.origin, this.raycaster.ray.direction.clone().multiplyScalar(18).add(this.raycaster.ray.origin) )
    // quickDrawBall( this.raycaster.ray.direction.clone().multiplyScalar(8).add(this.raycaster.ray.origin), 0.1 )
        
    // const items = _a.state.game.selectableItems;
    // this.intersects.length = 0;
    // 
    // for (var i = 0; i < items.length; i++) {  
    //   this.raycaster.ray.intersectBox(items[i].worldBounds);
    // }
    // 
    
    // var intersects = this.raycaster.intersectObjects( _o.selectableItems, false );
    // // for (var i = 0; i < intersects.length; i++) {
    // //   // debugger
    // //   intersects[i].object.position.y += 0.1;
    // //   intersects[i].object.updateMatrix();
    // // }
    // if (intersects.length > 0) {
    //   // debugger
    //     intersects[0].object.position.y += 0.1;
    //     intersects[0].object.updateMatrix();  
    // }
    // 
    
    const bb = new Box3();
    const bb2 = new Box3();
    
    // showing boxes
    // for (var i = 0; i < _o.selectableItems.length; i++) {
    //   _o.selectableItems[i].updateMatrix();
    //   _o.selectableItems[i].updateMatrixWorld();
    //   // _o.selectableItems[i].computeBoundingBox();
    // 
    //   bb2.setFromObject(_o.selectableItems[i], true)//.applyMatrix4(_o.selectableItems[i].matrixWorld)
    // 
    //   // console.log(bb2);
    // 
    //   // var helper = new Box3Helper( _o.selectableItems[i].boundingBox, 0x00ffff );
    //   // _a.state.game.scene.add(helper)
    // 
    //   var helper = new Box3Helper( bb2.clone(), 0x0000ff );
    //   _a.state.game.scene.add(helper)
    // 
    // }
    // 
    // 
    // return
    // debugger
    
    // baaaasic hit testing
    
    // console.log(bb2);
    // for (var i = 0; i < _o.selectableItems.length; i++) {
    // 
    //   _o.selectableItems[i].updateMatrix();
    //   _o.selectableItems[i].updateMatrixWorld();
    //   if (_o.selectableItems[i].boundingBox === null) {
    //     // _o.selectableItems[i].computeBoundingBox();
    //   }
    //   // bb.copy(_o.selectableItems[i].boundingBox).applyMatrix4(_o.selectableItems[i].matrixWorld)
    //   // bb2.setFromObject(_o.selectableItems[i])
    //   // bb2.setFromObject(_o.selectableItems[i], true).applyMatrix4(_o.selectableItems[i].matrixWorld)
    // 
    //   // NOTE!!! requuires percise true
    //   // BUT applyMatrix4 messes it up
    //   bb2.setFromObject(_o.selectableItems[i], true)//.applyMatrix4(_o.selectableItems[i].matrixWorld)
    // 
    //   // bb.copy(_o.selectableItems[i].boundingBox).applyMatrix4(_o.selectableItems[i].matrixWorld)
    // 
    //   // debugger
    //   if(this.raycaster.ray.intersectsBox(bb2) ){
    //     console.log("in");
    //     // debugger
    //     _o.selectableItems[i].position.y += 0.1;
    //     _o.selectableItems[i].updateMatrix();
    //   }
    // }
    
    
    // if(this.skipRaycast) return;
    
    ////////////
    let wasSelected = false;
    for (var i = 0; i < _o.selectableItems.length; i++) {
      
      _o.selectableItems[i].updateMatrix();
      _o.selectableItems[i].updateMatrixWorld();
      // _o.selectableItems[i].computeBoundingBox();
      bb2.setFromObject(_o.selectableItems[i], true)
      
      var vv = new Vector3();
      // if(this.raycaster.ray.intersectsBox(bb2) ){
      //   this.raycaster.ray.intersectBox(bb2, vv)
      //   quickDrawBall( vv, 0.1 )
      // }
      if( this.raycaster.ray.intersectBox(bb2, vv) !== null ){
        
        // quickDrawBall( vv, 0.1 )

        _o.transformWidget.attach( _o.selectableItems[i] );
        
        this.select( _o.selectableItems[i] );
        
        wasSelected = true;
      }
      
    }
    if (wasSelected === false && _o.transformWidget.visible){
      _o.transformWidget.detach ();
      this.select( this.selected );
    }
      
    
    
    
  }
  pointerUp(ev){
    this.isMouseDown = false;
    // if(this.selectedObject !== null && this.selectedObject.moveyThingTool){
    //   this.selectedObject.moveyThingTool.pointerUp(this.data);
    // }
    // console.log("select up");
  }

  pointerMoving(ev){}
  
  
  mouseSelecting(space){}
  


}
