

// var selectTool = new SelectTool(this.system);

/*

move logic moved to 
MoveyThingTool


debug within


plat = box4;
plat.boundingBox.print()

point = {x:0,y:0}
point.x = plat.boundingBox.min.x;
point.y = plat.boundingBox.max.y;

if(box){
box.delete()
box = null;
}
var box = new Plane("boxlike", point.x, point.y, 0, 10, 10, new Color().random());
APPPP.add(box);

pointInBoundingBoxScreenSpace(point, plat)

*/


import { Raycaster } from 'three';

import { Tool } from "../tool.js";

export class SelectTool extends Tool {
  
  raycaster = new Raycaster();
  
  selectedObject = null;
  
  isMouseDown = false;
  // mPointerPos = new Vector3();
  // mSelectedPos = new Vector3();
  // 
  // previousGoodPosition = new Vector3();
  // workPos = new Vector3();
  
  
  usePreventCollide = false;
  // usePreventCollide = true;
  
  tapTimer = 0;
  tapLimit = 0.2;
  
  
  useGrid = false;
  grid = null;

  // posWorkVectorToMegas = new Vector3();
  
  data = {
    
  }

  // need a grid
  // so its .snap()
  // 
  // var grid = new Grid(40,20,40, this.system);
  // // grid.snap(_this.system.pointer.client.x, _this.system.pointer.client.y).screenTo3D();
  // // 
  // // box2.x = grid.position3D.x;
  // // box2.y = grid.position3D.y;
  // 
  // 



  constructor({store,domElement, system, name = "SelectTool", displayName = "Select Tool"} = {}){
    super({store, domElement, system, name, displayName});
  }
  
  
  modes = {
    mousing : "mousing",
    // canDrag : "canDrag",
    // canDraw : "canDraw"
  }
  
  mode = this.modes.mousing;
  
  
  start(){
    // this.start();
    super.start();
      
    // this.bindUpEvent();
    // this.bindDownEvent();
    // 
    // // this.system.loopHookPoints.editorBeforeDraw = () => {
    // //   this.update();
    // // };

  }
  
  update(){
    this.mouseSelecting();
    this.pointerMoving();
  }
  
  pointerDown(){
    this.isMouseDown = true;
    // if(this.selectedObject !== null && this.selectedObject.moveyThingTool){
    //   // this.selectedObject.moveyThingTool.pointerDown(this.data);
    // }
    console.log("select down");
    
    let _o = this.store.state.game;
    // sdklvfmdfgmdfgh
    // 
    // need to have saved box onto model
    // see nifftyshoes and the react game
    // otherwise you can do a live box3 and then intersect box3 instead
    // somewhere theres exaustion
    
    var intersects = this.raycaster.intersectObjects( _o.selectableItems, true );
    for (var i = 0; i < intersects.length; i++) {
      intersects[i].position.y += 0.1;
    }
    
    
  }
  pointerUp(){
    this.isMouseDown = false;
    // if(this.selectedObject !== null && this.selectedObject.moveyThingTool){
    //   this.selectedObject.moveyThingTool.pointerUp(this.data);
    // }
    console.log("select up");
  }

  pointerMoving(){

  }
  


  // this should inspead of some large form stack of logics
  // it should add on a drag type of tool
  
  pickedList = [];
  
  
  mouseSelecting(space){
    
    
  }
  


}
