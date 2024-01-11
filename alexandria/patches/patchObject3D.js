// we need a core patch of object3D to have interfaces
// so this is the simpliest route

// Documentation
// https://rapier.rs/docs/api/javascript/JavaScript3D

import {
  Object3D,
  Vector3,
  Box3,
  Box3Helper,
  Sphere,
  Ray,
  Matrix4
} from 'three';
import { mergeVertices } from "three-stdlib";

import Physics from '@dimforge/rapier3d-compat';

import { addEntity, addComponent } from 'bitecs';

import { store } from 'alexandria/store';
import { Object3DComponent, DynamicPhysicsComponent } from 'alexandria/ecs/components';

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

  const rigidBodyTypes = ['dynamic', 'fixed', 'kinematicPositionBased', 'kinematicVelocityBased'];
  const physicsKeys = ['rigidBody', 'collider', 'linvel', 'angvel', 'gravityScale'];

  Object3D.prototype.computeBoundingBox = function() {

    const bounding = new Box3().setFromObject(this);
    this.boundingBox = bounding.getSize(new Vector3()).multiplyScalar(0.5);
  };

  Object3D.prototype.initPhysics = function(physConfig) {

    const { rigidBody, linvel, angvel } = physConfig;
    let { collider = { type: 'cuboid' } } = physConfig;

    const rigidBodySettings = [
      'gravityScale' // float
    ];
    const colliderDescSettings = [
      'centerOfMass', // vec3
      'enabled' // bool
    ];
    const colliderSettings = [
      'sensor', // bool
      'collisionGroups', // num
      'solverGroups', // num
      'friction', // num
      'frictionCombineRule', // Physics.CoefficientCombineRule.*
      'restitution', // num
      'restitutionCombineRule', // Physics.CoefficientCombineRule.*
      'density', // num
      'mass', // num
      'massProperties', // { mass: num, centerOfMass: vec3, principalAngularInertia: vec3, angularInertiaLocalFrame: quat }
      'rotation', // quat,
      'translation' // vec3
    ];

    const ecsCore = store.state.ecs.core;
    const eid = addEntity(ecsCore, Object3DComponent);
    this.eid = eid;

    const physCore = store.state.physics.core;

    const invalidKeys = Object.keys(physConfig).filter((key) => !physicsKeys.includes(key));

    if (invalidKeys.length) {
      throw new Error(`Invalid keys passed to object3D.initPhysics: '${invalidKeys}'`)
    }

    if (rigidBody) {
      if (!rigidBodyTypes.includes(rigidBody)) {
        throw new Error(`Invalid rigidBody '${rigidBody}'. Must be one of ${rigidBodyTypes}`);
      }

      const rigidBodyDesc = Physics.RigidBodyDesc[rigidBody]()
        .setTranslation(...this.position);
        // TODO really should get this rotation working
        // .setRotation(this.rotation);

      if (linvel) {
        if (linvel.length !== 3) {
          throw new Error('linvel requires an array of numbers [x, y, z]');
        }
        rigidBodyDesc.setLinvel(...linvel);
      }

      // TODO angvel sorta works idk
      if (angvel) {
        if (typeof angvel !== 'number') {
          throw new Error('angvel must be a number');
        }
        rigidBodyDesc.setAngvel(angvel);
      }

      this.rigidBody = physCore.createRigidBody(rigidBodyDesc);

      // Update rigidBody for each valid key
      Object.keys(physConfig)
        .filter((key) => rigidBodySettings.includes(key))
        .forEach((key) => {

          const rigidBodyFunc = `set${key.slice(0, 1).toUpperCase() + key.slice(1)}`;
          console.log('rigidBodyFunc', rigidBodyFunc);

          this.rigidBody[rigidBodyFunc](physConfig[key]);
        });

      // TODO support more collider types
      // See docs https://rapier.rs/docs/api/javascript/JavaScript3D

      let colliderDesc;

      this.computeBoundingBox();

      if (typeof collider === 'string') {
        collider = { type: collider };
      }

      switch (collider.type) {
      case 'ball':
      case 'sphere':
        this.geometry.computeBoundingSphere();
        colliderDesc = Physics.ColliderDesc.ball(
          this.geometry.boundingSphere.radius // number
        );
        break;
      case 'capsule':
        colliderDesc = Physics.ColliderDesc.capsule(
          collider.halfHeight, // number
          collider.radius // number
        );
        break;
      case 'trimesh': {
        const geomClone = this.geometry.index
          ? this.geometry.clone()
          : mergeVertices(this.geometry);

        colliderDesc = Physics.ColliderDesc.trimesh(
          geomClone.attributes.position.array, // vertices Float32Array
          geomClone.index?.array // indices Uint32Array
        );
      }
        break;
      case 'convexHull':
      case 'hull': {
        const geomClone = this.geometry.clone();

        colliderDesc = Physics.ColliderDesc.convexHull(
          geomClone.attributes.position.array // points Float32Array
        );
      }
        break;
      case 'roundConvexHull':
      case 'roundHull': {
        const geomClone = this.geometry.clone();

        colliderDesc = Physics.ColliderDesc.roundConvexHull(
          geomClone.attributes.position.array, // points Float32Array
          collider.borderRadius // number
        );
      }
        break;
      case 'convexMesh':
      case 'mesh': {
        const geomClone = this.geometry.index
          ? this.geometry.clone()
          : mergeVertices(this.geometry);

        colliderDesc = Physics.ColliderDesc.convexMesh(
          geomClone.attributes.position.array, // vertices Float32Array
          geomClone.index?.array // indices Uint32Array
        );
      }
        break;
      case 'roundConvexMesh':
      case 'roundMesh': {
        const geomClone = this.geometry.index
          ? this.geometry.clone()
          : mergeVertices(this.geometry);

        colliderDesc = Physics.ColliderDesc.roundConvexMesh(
          geomClone.attributes.position.array, // vertices Float32Array
          geomClone.index?.array, // indices Uint32Array
          collider.borderRadius // number
        );
      }
        break;
      case 'cylinder':
        colliderDesc = Physics.ColliderDesc.cylinder(
          collider.halfHeight, // number
          collider.radius // number
        );
        break;
      case 'roundCylinder':
        colliderDesc = Physics.ColliderDesc.roundCylinder(
          collider.halfHeight, // number
          collider.radius, // number
          collider.borderRadius // number
        );
        break;
      case 'cone':
        colliderDesc = Physics.ColliderDesc.cone(
          collider.halfHeight, // number
          collider.radius // number
        );
        break;
      case 'roundCone':
        colliderDesc = Physics.ColliderDesc.roundCone(
          collider.halfHeight, // number
          collider.radius, // number
          collider.borderRadius // number
        );
        break;
      case 'triangle':
        colliderDesc = Physics.ColliderDesc.triangle(
          collider.a, // vec3
          collider.b, // vec3
          collider.c // vec3
        );
        break;
      case 'roundTriangle':
        colliderDesc = Physics.ColliderDesc.roundTriangle(
          collider.a, // vec3
          collider.b, // vec3
          collider.c, // vec3
          collider.borderRadius // number
        );
        break;
      case 'segment':
        colliderDesc = Physics.ColliderDesc.segment(
          collider.a, // vec3
          collider.b // vec3
        );
        break;
      case 'polyline': {
        const geomClone = this.geometry.index
          ? this.geometry.clone()
          : mergeVertices(this.geometry);

        colliderDesc = Physics.ColliderDesc.polyline(
          geomClone.attributes.position.array, // vertices Float32Array
          geomClone.index?.array // indices Uint32Array
        );
      }
        break;
      case 'heightfield':
        colliderDesc = Physics.ColliderDesc.heightfield(
          collider.rows, // number
          collider.cols, // number
          collider.heights, // Float32Array The heights of the heightfield along its local y axis, provided as a matrix stored in column-major order.
          collider.scale // vec3
        );
        break;
      case 'cuboid':
        colliderDesc = Physics.ColliderDesc.cuboid(
          ...this.boundingBox
        );
        break;
      case 'roundCuboid':
        colliderDesc = Physics.ColliderDesc.roundCuboid(
          ...this.boundingBox,
          collider.borderRadius // number
        );
        break;
      }

      if (collider.isSensor) {
        colliderDesc.isSensor = true;
      }

      // Update collider for each valid key, copied most ideas from
      // https://github.com/pmndrs/react-three-rapier/blob/main/packages/react-three-rapier/src/utils/utils-collider.ts
      Object.keys(collider)
        .filter((key) => colliderDescSettings.includes(key))
        .forEach((key) => {

          const colliderDescVal = `set${key.slice(0, 1).toUpperCase() + key.slice(1)}`;

          colliderDesc[colliderDescVal] = collider[key];
        });

      if (collider.onCollisionEvent && collider.onForceEvent) {
        colliderDesc.setActiveEvents(
          Physics.ActiveEvents.COLLISION_EVENTS
          | Physics.ActiveEvents.CONTACT_FORCE_EVENTS
        );
        this.onCollisionEvent = collider.onCollisionEvent;
        this.onContactForceEvent = collider.onContactForceEvent;
      }
      else if (collider.onCollisionEvent) {
        colliderDesc.setActiveEvents(
          Physics.ActiveEvents.COLLISION_EVENTS
        );
        this.onCollisionEvent = collider.onCollisionEvent;
      }
      else if (collider.onContactForceEvent) {
        colliderDesc.setActiveEvents(
          Physics.ActiveEvents.CONTACT_FORCE_EVENTS
        );
        this.onContactForceEvent = collider.onContactForceEvent;
      }

      this.collider = physCore.createCollider(colliderDesc, this.rigidBody);

      if (rigidBody === 'dynamic' || collider.isSensor) {
        addComponent(ecsCore, DynamicPhysicsComponent, eid);
        DynamicPhysicsComponent.objectId[eid] = this.id;
      }

      // Add collider handle for lookup during collision time
      DynamicPhysicsComponent.objForColliderHandle[this.collider.handle] = this;

      if (collider.density && (collider.mass || collider.massProperties)) {
        throw new Error('Can\'t set both density and mass on collider');
      }

      // Update collider for each valid key, copied most ideas from
      // https://github.com/pmndrs/react-three-rapier/blob/main/packages/react-three-rapier/src/utils/utils-collider.ts
      Object.keys(collider)
        .filter((key) => colliderSettings.includes(key))
        .forEach((key) => {

          const colliderFunc = `set${key.slice(0, 1).toUpperCase() + key.slice(1)}`;

          if (key === 'massProperties') {
            const val = collider[key];
            this.collider[colliderFunc](
              val.mass,
              val.centerOfMass,
              val.principalAngularInertia,
              val.angularInertiaLocalFrame
            );
          }
          else {
            this.collider[colliderFunc](collider[key]);
          }
        });
    }
  }

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
  //   if ( this.boundingBox === null ) {
  //     this.boundingBox = new Box3();
  //   }
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
