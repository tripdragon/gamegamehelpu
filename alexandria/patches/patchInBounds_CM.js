

import {
  Object3D,
  Vector3,
  Box3,
  Box3Helper,
  Sphere,
  Ray,
  Matrix4,
  Mesh
} from 'three';

import { CubeMesh } from 'alexandria/primitives/cubeMesh.js';

export function patchInBounds_CM(){
  console.log("patchInBounds_CM");

  // window.CubeMesh = CubeMesh;
  // 
  // Object3D.prototype.narfs = function(){
  //   console.log("in Object3D 111");
  // }  
  // 
  // Mesh.prototype.narfs = function(){
  //   // cant use super here, think this is the same
  //   Object3D.prototype.narfs.call(this);
  //   console.log("in mesh 222");
  // }
  // 

  // //
  // // // changing the world and local bounds idea
  // // // trying for a direct three patch to maybe be included
  // Object3D.prototype.boundingBox = null;
  // Object3D.prototype.boundingSphere = null;
  // 
  // Object3D.prototype.boundingBox = undefined;
  // Object3D.prototype.boundingSphere = undefined;
  
  
    // //
    // //
    // //
    // // #BUG we need precise to fix lota internal things
    // // from setting the box settings to Infinity as defaults
    // 
    // Object3D.prototype.computeBoundingBox = function(precise=true) {
    //   if(this.isMesh){
    //     // debugger
    //     Mesh.prototype.computeBoundingBox.call(this);
    //   }
    //   else {
    //     if ( this.boundingBox === null ) {
    //       this.boundingBox = new Box3();
    //     }
    //     this.boundingBox.setFromObject(this, precise);
    // 
    //   }
    // }
    // // 
    // // 
    // // Object3D.prototype.computeBoundingSphere = function() {}
    // Object3D.prototype.computeBoundingSphere = function() {
    //   if(this.isMesh){
    //     // debugger
    //     // this.super.computeBoundingSphere();
    //     Mesh.prototype.computeBoundingSphere.call(this);
    //   }
    //   else {  
    //     if ( this.boundingBox === null ) {
    //       this.computeBoundingBox();
    //     }
    //     if (this.boundingBox && this.boundingSphere === null) {
    //       this.boundingSphere = new Sphere();
    //     }
    //     this.boundingBox.getBoundingSphere(this.boundingSphere);
    //   }
    // }
    // 
    // 
    // 
    
      // 
      // 
    	// Object3D.prototype.computeBoundingBox = function() {
      // 
    	// 	const geometry = this.geometry;
      // 
    	// 	if ( this.boundingBox === null ) {
      // 
    	// 		this.boundingBox = new Box3();
      // 
    	// 	}
      // 
    	// 	this.boundingBox.makeEmpty();
      // 
      //   this.boundingBox.setFromObject(this, true);
      // 
    	// }
      // 
    	// Object3D.prototype.computeBoundingSphere = function() {
      // 
    	// 	const geometry = this.geometry;
      // 
    	// 	if ( this.boundingSphere === null ) {
      // 
    	// 		this.boundingSphere = new Sphere();
      // 
    	// 	}
      // 
      //   if( this.boundingBox === null ){
      //     this.computeBoundingBox();
      //   }
      // 
    	// 	this.boundingSphere.makeEmpty();
      // 
      //   this.boundingBox.getBoundingSphere(this.boundingSphere);
      // 
    	// }
      // 
      // 
      // 
      // 
      // 
    
    
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
      
}
