
import { Tool } from "../tool.js";
import { Vector3, Plane, Vector2 } from "three";

import { Box3, Box3Helper } from 'three';

import { GetPositionOfRaycasterFromFloor, GetMousePositionToScreen } from 'alexandria/mousetools/mouseScreenTools.js';



export class StampTool extends Tool {
  
  targetObject;
  targetObjectName = '';
  targetScene = null;
  
  targetVecOfPlane = new Vector3();
  
  floorPlane = new Plane(new Vector3(0,1,0), 0);
  
  store = null;
  
  mPointerDown = new Vector2();
  mPointerWork = new Vector2();
  
  // needs targetScene + targetObject
  // needs all things so also store
  // But targetScene and targetObject should be adjustable after setup
  
  constructor({store, targetObjectName, targetObject, targetScene, domElement, system, name = "StampTool", displayName = "Stamp Tool"} = {}){
    
    super({domElement, system, name, displayName});
    
    // if(!targetObject) console.warn("must have targetObject", name);
    if(!store) console.warn("must have store", name);
    if(!targetScene) console.warn("must have targetScene", name);
    if(!targetObjectName) console.warn("must have targetObjectName", name);
    
    this.targetObject = targetObject;
    this.targetScene = targetScene;
    this.targetObjectName = targetObjectName;
    this.store = store;
    
  }
  
  
  start(){
    super.start();
    
    let _o = this.store.state.game;
    
    // const foundItem1 = store.state.game.importedModels.findModelByName("trees_mwoie_1");    
    // let piece2 = foundItem1.clone();
    
    if( !this.targetObject ){
      // debugger
      this.targetObject = _o.importedModels.findModelByName(this.targetObjectName);
    }
    if (!this.targetObject) {
      console.log("this.targetObject is still missing here ya");
      return;
    }

  }




  pointerDown(ev){
    let _o = this.store.state.game;
    // 
    // let piece2 = this.targetObject.clone();
    // 
    // this.targetScene.add(piece2);
    // 
    // piece2.position.x = Math.random() * 4;
    // piece2.position.z = Math.random() * 4;
    // 
    // _o.planningBoard.add(piece2);
    // 
    // GetPositionOfRaycasterFromFloor({domElement: this.domElement, ev:ev, camera: _o.camera, floorPlane:this.floorPlane, vector3in: this.targetVecOfPlane});
    // // _o.onConsole.log("isdownBbb", "isdownBbb");
    // 
    // piece2.position.copy(this.targetVecOfPlane);
    // 
    // // _o.controls.enabled = false;
    // 
    
    
    // GetMousePositionToScreen(ev.clientX, ev.clientY, _o.domElement,  this.mPointerDown);
    // this.mPointerDown.set(ev.clientX, ev.clientY);
    
    
    this.placeObject(ev);
    
  }
  
  pointerUp(ev){
    super.pointerUp(ev);
    let _o = this.store.state.game;
    // _o.controls.enabled = true;
    
    // this.placeObject(ev);
    
    // // tooooo small, need distance
    // this.mPointerWork.set(ev.clientX, ev.clientY);
    // const dis = this.mPointerWork.distanceTo(this.mPointerDown);
    // // console.log("dis", dis);
    // if(dis <= 0.2){
    //     this.placeObject(ev);
    //     _o.controls.enabled = false;
    // }
    // // if(this.mPointerDown.x === ev.clientX && this.mPointerDown.y === ev.clientY){
    // //   debugger
    // // }
    
  }


  placeObject(ev){
    let _o = this.store.state.game;
    
    this.targetObject.updateMatrix();
    let piece2 = this.targetObject.clone();
    
    this.targetScene.add(piece2);
    store.state.game.selectableItems.add(piece2);
    
    piece2.position.x = Math.random() * 4;
    piece2.position.z = Math.random() * 4;
    
    _o.planningBoard.add(piece2);
    
    GetPositionOfRaycasterFromFloor({domElement: this.domElement, ev:ev, camera: _o.camera, floorPlane:this.floorPlane, vector3in: this.targetVecOfPlane});
    
    piece2.position.copy(this.targetVecOfPlane);
    piece2.updateMatrix();
    
    // _o.controls.enabled = false;

    // piece2.buildBoxHelper(store.state.game.helpersGroup);
    // piece2.computeLocalAndWorldBounds();
    // piece2.moreBuild_CM({targetGroup:store.state.game.helpersGroup});
    
  }
  
}
