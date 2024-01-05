// we need a core patch of object3D to have interfaces
// so this is the simpliest route

import {
  Object3D,
  Vector3,
  Box3,
  Box3Helper,
  Sphere,
  Ray,
  Matrix4
} from 'three';

import { store } from 'alexandria/store';

function ascSort(a, b) {
	return a.distance - b.distance;
}

export function patchObject3D_CM() {

  const _intersectionPointWorld = /*@__PURE__*/ new Vector3();
  const _point = /*@__PURE__*/ new Vector3();

  const _inverseMatrix = /*@__PURE__*/ new Matrix4();
  const _ray = /*@__PURE__*/ new Ray();
  const _sphere = /*@__PURE__*/ new Sphere();
  const _sphereHitAt = /*@__PURE__*/ new Vector3();


  Object3D.prototype.fish = 'neat!!';
  Object3D.prototype.entities = {};
  
	// addresses onSelected, onUnseleced
	Object3D.prototype.isSelected = false;
	Object3D.prototype.select = function(){}
	Object3D.prototype.deselect = function(){}
	

  Object3D.prototype.simplePhysics = {
    velocity: new Vector3(),
    acceleration : new Vector3(),
    force: new Vector3()
  }



  Object3D.prototype.setAutoMatrixAll = function(parentVal = true, val = true){
		this.matrixAutoUpdate = parentVal;
		this.traverse((item) => {
			item.matrixAutoUpdate = val;
		});
  }



  // //
  // // // changing the world and local bounds idea
  // // // trying for a direct three patch to maybe be included
  // Object3D.prototype.boundingBox = null;
  // Object3D.prototype.boundingSphere = null;
  // //
  // //
  // //
  // // #BUG we need precise to fix lota internal things
  // // from setting the box settings to Infinity as defaults
	// Object3D.prototype.computeBoundingBox = function(precise=true) {
	// 	if ( this.boundingBox === null ) {
	// 		this.boundingBox = new Box3();
	// 	}
  //   this.boundingBox.setFromObject(this, precise);
	// }
	// Object3D.prototype.computeBoundingSphere = function() {
  //   if ( this.boundingBox === null ) {
  //     this.computeBoundingBox();
  //   }
  //   if (this.boundingBox && this.boundingSphere === null) {
  //     this.boundingSphere = new Sphere();
  //   }
  //   this.boundingBox.getBoundingSphere(this.boundingSphere);
	// }
  //
  //
  //
  // Object3D.prototype.raycast = function( raycaster, intersects ) {
  //
	// 	const matrixWorld = this.matrixWorld;
  //
	// 	// test with bounding sphere in world space
  //
	// 	if ( this.boundingSphere === null ) this.computeBoundingSphere();
  //
	// 	_sphere.copy( this.boundingSphere );
	// 	_sphere.applyMatrix4( matrixWorld );
  //
	// 	// check distance from ray origin to bounding sphere
  // // debugger
	// 	// _ray.copy( raycaster.ray ).recast( raycaster.near );
	// 	_ray.copy( raycaster.ray ).recast( raycaster.near );
  //
	// 	// if ( _sphere.containsPoint( _ray.origin ) === false ) {
  //   //
	// 	// 	if ( _ray.intersectSphere( _sphere, _sphereHitAt ) === null ) return;
  //   //
	// 	// 	if ( _ray.origin.distanceToSquared( _sphereHitAt ) > ( raycaster.far - raycaster.near ) ** 2 ) return;
  //   //
	// 	// }
  // // debugger
	// 	// convert ray to local space of mesh
  //
	// 	// _inverseMatrix.copy( matrixWorld ).invert();
	// 	// _ray.copy( raycaster.ray ).applyMatrix4( _inverseMatrix );
  //
	// 	// test with bounding box in local space
  //
  //   //
  //   // start here for new routines
  //   //
  //
  //   // if ( this.boundingSphere === null ) this.computeBoundingBox();
  //   if ( this.boundingBox === null ) {
  //     this.computeBoundingBox();
  //   }
  //   // if ( this.boundingBox === null ) return;
  //   debugger
  //
	// 	if ( _ray.intersectBox( this.boundingBox, _intersectionPointWorld ) === null ) return;
	// 	// if ( _ray.intersectBox( this.boundingBox, this._intersectionPointWorld ) === false ) return;
	// 	// if ( ! _ray.intersectBox( this.boundingBox, this._intersectionPointWorld ) ) return;
  //
  // debugger
  //
  //   // _intersectionPointWorld.copy( point );
  //   // _intersectionPointWorld.applyMatrix4( object.matrixWorld );
  //
  //
  //   _point.copy( _intersectionPointWorld );
  //   _point.applyMatrix4( this.matrixWorld );
  //
  //   const distance = raycaster.ray.origin.distanceTo( _point );
  //   console.log("distance", distance);
  //
  //   if ( distance < raycaster.near || distance > raycaster.far ) return null;
  //
  // // debugger
  //
  //   const intersection = {
  //     distance: distance,
  //     point: _intersectionPointWorld.clone(),
  //     object: this
  //   };
  //
  //   intersects.push( intersection );
  //
  //   intersects.sort( ascSort );
  //
  //   return intersects;
	// }
  //
  //


  // object3's dont have a bounds, so we force one!!!
  // and optimise for cache
  // after such, if you move the object youll need to run computeWorldBounds again
  // which might mean every frame. you have to deside if you need that for like raycasts
  Object3D.prototype.worldBounds = new Box3();
  Object3D.prototype.localBounds = new Box3();
  Object3D.prototype.computeLocalBounds = function(autoUpdate = true){
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


  Object3D.prototype.moreBuild_CM = function({targetGroup}){
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

  // this is a HARD CODED thing for debugging only
  Object3D.prototype.quickDrawBox = function(){
    this.updateMatrix();
    this.computeBoundingBox();
    var helper = new Box3Helper( this.boundingBox, 0x0000ff );
    store.state.game.scene.add(helper);
  }

  // Object3D.prototype.refreshBoxHelper = function(){
  //   this.boxHelperPointer?.box.setFromObject(this);
  // }

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
