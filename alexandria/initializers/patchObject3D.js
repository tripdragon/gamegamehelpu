// we need a core patch of object3D to have interfaces
// so this is the simpliest route

import { Object3D, Vector3, Box3, Box3Helper } from 'three';



export function patchObject3D_CM() {

  Object3D.prototype.fish = 'neat!!';
  Object3D.prototype.entities = {};

  Object3D.prototype.simplePhysics = {
    velocity: new Vector3(),
    accelration : new Vector3(),
    force: new Vector3()
  }
  
  // object3's dont have a bounds, so we force one!!!
  // and optimise for cache
  // after such, if you move the object youll need to run computeWorldBounds again
  // which might mean every frame. you have to deside if you need that for like raycasts
  Object3D.prototype.worldBounds = new Box3();
  Object3D.prototype.localBounds = new Box3();
  Object3D.prototype.computeLocalBounds = function(autoUpdate= true){
      if(autoUpdate)this.updateMatrix();
      this.localBounds.setFromObject(this);
  }
  Object3D.prototype.computeWorldBounds = function(autoUpdate = true){
      if(autoUpdate)this.updateMatrix();
      // if(autoUpdate)this.updateWorldMatrix();
      this.worldBounds.copy(this.localBounds);
      this.worldBounds.applyMatrix4(this.matrixWorld);
  }
  // inavertly we compute updateMatrix a lot now when cloning
  Object3D.prototype.computeLocalAndWorldBounds = function(){
    this.computeLocalBounds();
    this.computeWorldBounds();
  }
  
  
  Object3D.prototype.postClone_CM = function({targetGroup}){
    this.buildBoxHelper(targetGroup);
    this.computeLocalAndWorldBounds();
  }
  
  
  // Since we cant parent the helper to an object and retain a
  // performant update, we setup another group object and add it there
  // so we need a basic pointer to hide it when needed
  // #TODO replace for parented object instead :
  Object3D.prototype.boxHelperPointer = null;
  
  // @ targetGroup : store.state.game.helpersGroup
  // would Reeeeealy like to not add this to an external group
  Object3D.prototype.buildBoxHelper = function(targetGroup){
    this.updateMatrix();
    const box = new Box3();
    box.setFromObject(this);
    const helper = new Box3Helper( box, 0x0000ff );
    this.boxHelperPointer = helper;
    helper.ownerObject = this;
    targetGroup.add(helper);
  }
  
  // call updateMatrix before hand
  Object3D.prototype.refreshBoxHelper = function(){
    this.boxHelperPointer?.box.setFromObject(this);
  }
  
  // call this.updateMatrix(); before this
  // Object3D.prototype.clone = function(recursive){
  //   const yy = new this.constructor().copy( this, recursive );
  //   if (this.boxHelperPointer) {
  //     yy.buildBoxHelper(this.boxHelperPointer.parent);
  //     yy.computeLocalBounds();
  //     yy.computeWorldBounds();
  //   }
  //   yy.updateMatrix();
  //   return yy;
  // }
  
  
  // Object3D.prototype.computeBox3Bounds = function(){
  // 
  //   this.updateMatrix();
  //   const box = new Box3();
  //   box.setFromObject(piece2)
  // 
  //   // const helper = new Box3Helper( box, 0xffff00 );
  //   const helper = new Box3Helper( box, 0x0000ff );
  //   piece2.boxHelperPointer = helper;
  //   store.state.game.helpersGroup.add(helper);
  // 
  // }
  
  

  // these wont set
  // Object3D.prototype.matrixAutoUpdate = false;
  // Object3D.prototype.matrixWorldAutoUpdate = false;

}
