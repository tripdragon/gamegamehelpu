
// More logic to handle when importing model instead of just adding stuff to
// Object3d
// Motivation, put bounding box onto Object3D and save imported gltf animations stuff

// from discussion
// https://github.com/mrdoob/three.js/issues/27493
// The SkinnedMesh implements object level bounding box
// So lets just scoop that code out!! and swap in some box check stuff
// https://threejs.org/docs/index.html?q=mesh#api/en/objects/SkinnedMesh


import { Group } from 'three';

export class ImportedModel extends Group {
  
  isImportedModel = true;
  
  animations = null;
  userData = {};
  
  constructor({loaderResult, customName, addShadows } = {}){
    super();
    
    // swap out objects IF its the first time model is loaded
    if(loaderResult){
      
      // these might need more copy routines, but for now carry on with game!!!
      this.animations = loaderResult.animations;
      this.userData = loaderResult.userData;
      
      for (var i = 0; i < loaderResult.scene.children.length; i++) {
        this.add(loaderResult.scene.children[i]);
      }
    }
    
    if(customName) this.name = customName;
    if(addShadows) this.buildShadows();
    
  }
  
  
  // models dont provide shadows by default
  buildShadows(){  
    this.traverse((item) => {
      if (item.isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
      
  }
  
  
  // here lie attempts to move bounding box into top level logic
  
  // boundingBox = null;
  // boundingSphere = null;
  
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

  
}
