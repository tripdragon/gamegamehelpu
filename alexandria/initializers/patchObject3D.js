// we need a core patch of object3D to have interfaces
// so this is the simpliest route

import { Object3D, Vector3, Box3 } from 'three';

export function patchObject3D_CM() {

  Object3D.prototype.fish = 'neat!!';
  Object3D.prototype.entities = {};
  
  // object3's dont have a bounds, so we force one!!!
  Object3D.prototype.worldBounds = new Box3();
  Object3D.prototype.computeWorldBounds = function(){
      // this.updateMatrix();
      this.updateWorldMatrix();
  }
  
  
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
  
  
  // Since we cant parent the helper to an object and retain a
  // performant update, we setup another group object and add it there
  // so we need a basic pointer to hide it when needed
  // #TODO replace for parented object instead :
  Object3D.prototype.boxHelperPointer = null;
  
  // these wont set
  // Object3D.prototype.matrixAutoUpdate = false;
  // Object3D.prototype.matrixWorldAutoUpdate = false;

  Object3D.prototype.simplePhysics = {
    velocity: new Vector3(),
    accelration : new Vector3(),
    force: new Vector3()
  }
}
