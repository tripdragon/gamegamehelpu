// Documentation
// https://rapier.rs/docs/api/javascript/JavaScript3D

// Copied decent amt of ideas from
// https://github.com/pmndrs/react-three-rapier/blob/main/packages/react-three-rapier/src/utils/utils-collider.ts

import Physics from '@dimforge/rapier3d-compat';
import { mergeVertices } from 'three-stdlib';
import { addComponent } from 'bitecs';

import { DynamicPhysicsComponent } from 'alexandria/ecs/components';
import { store } from 'alexandria/store';

// Need to create a module initECS that initializes an obj to ECS
// It can check if the obj already has obj.ecsId or something and return if it does

// Move initPhysics to its own module and pass in the object to place
// in the physics system
export const initPhysics = (obj, physConfig) => {

  const { rigidBody, linvel, angvel } = physConfig;
  let { collider = { type: 'cuboid' } } = physConfig;

  const rigidBodyTypes = ['dynamic', 'fixed', 'kinematicPositionBased', 'kinematicVelocityBased'];
  const physicsKeys = ['rigidBody', 'collider', 'linvel', 'angvel', 'gravityScale', 'onCollision', 'onContactForce'];

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

  const physCore = store.state.physics.core;

  const invalidKeys = Object.keys(physConfig).filter((key) => !physicsKeys.includes(key));

  if (invalidKeys.length) {
    console.warn(`Invalid keys passed to object3D.initPhysics: '${invalidKeys}'`)
    return;
  }

  if (rigidBody) {
    if (!rigidBodyTypes.includes(rigidBody)) {
      console.warn(`Invalid rigidBody '${rigidBody}'. Must be one of ${rigidBodyTypes}`);
      return;
    }

    const rigidBodyDesc = Physics.RigidBodyDesc[rigidBody]()
      .setTranslation(...obj.position);
      // TODO really should get this rotation working
      // .setRotation(obj.rotation);

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

    obj.rigidBody = physCore.createRigidBody(rigidBodyDesc);

    // Update rigidBody for each valid key
    Object.keys(physConfig)
      .filter((key) => rigidBodySettings.includes(key))
      .forEach((key) => {

        const rigidBodyFunc = `set${key.slice(0, 1).toUpperCase() + key.slice(1)}`;
        console.log('rigidBodyFunc', rigidBodyFunc);

        obj.rigidBody[rigidBodyFunc](physConfig[key]);
      });

    // TODO support more collider types
    // See docs https://rapier.rs/docs/api/javascript/JavaScript3D

    let colliderDesc;

    obj.computeBoundingBox();

    if (typeof collider === 'string') {
      collider = { type: collider };
    }

    switch (collider.type) {
    case 'cuboid':
      colliderDesc = Physics.ColliderDesc.cuboid(
        ...obj.boundingBox
      );
      break;
    case 'roundCuboid':
      colliderDesc = Physics.ColliderDesc.roundCuboid(
        ...obj.boundingBox,
        collider.borderRadius // number
      );
      break;
    case 'ball':
    case 'sphere':
      obj.geometry.computeBoundingSphere();
      colliderDesc = Physics.ColliderDesc.ball(
        obj.geometry.boundingSphere.radius // number
      );
      break;
    case 'capsule':
      colliderDesc = Physics.ColliderDesc.capsule(
        collider.halfHeight, // number
        collider.radius // number
      );
      break;
    case 'trimesh': {
      const geomClone = obj.geometry.index
        ? obj.geometry.clone()
        : mergeVertices(obj.geometry);

      colliderDesc = Physics.ColliderDesc.trimesh(
        geomClone.attributes.position.array, // vertices Float32Array
        geomClone.index?.array // indices Uint32Array
      );
    }
      break;
    case 'convexHull':
    case 'hull': {
      const geomClone = obj.geometry.clone();

      colliderDesc = Physics.ColliderDesc.convexHull(
        geomClone.attributes.position.array // points Float32Array
      );
    }
      break;
    case 'roundConvexHull':
    case 'roundHull': {
      const geomClone = obj.geometry.clone();

      colliderDesc = Physics.ColliderDesc.roundConvexHull(
        geomClone.attributes.position.array, // points Float32Array
        collider.borderRadius // number
      );
    }
      break;
    case 'convexMesh':
    case 'mesh': {
      const geomClone = obj.geometry.index
        ? obj.geometry.clone()
        : mergeVertices(obj.geometry);

      colliderDesc = Physics.ColliderDesc.convexMesh(
        geomClone.attributes.position.array, // vertices Float32Array
        geomClone.index?.array // indices Uint32Array
      );
    }
      break;
    case 'roundConvexMesh':
    case 'roundMesh': {
      const geomClone = obj.geometry.index
        ? obj.geometry.clone()
        : mergeVertices(obj.geometry);

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
      const geomClone = obj.geometry.index
        ? obj.geometry.clone()
        : mergeVertices(obj.geometry);

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
    }

    if (collider.sensor) {
      colliderDesc.sensor = true;
    }

    // Update collider for each valid key, copied most ideas from
    // https://github.com/pmndrs/react-three-rapier/blob/main/packages/react-three-rapier/src/utils/utils-collider.ts
    Object.keys(collider)
      .filter((key) => colliderDescSettings.includes(key))
      .forEach((key) => {

        const colliderDescVal = `set${key.slice(0, 1).toUpperCase() + key.slice(1)}`;

        colliderDesc[colliderDescVal] = collider[key];
      });

    // Allow setting these events without putting the keys directly in 'collider'
    if (!collider.onCollision && physConfig.onCollision) {
      collider.onCollision = physConfig.onCollision;
    }

    if (!collider.onContactForce && physConfig.onContactForce) {
      collider.onContactForce = physConfig.onContactForce;
    }

    if (collider.onCollision && collider.onContactForce) {
      colliderDesc.setActiveEvents(
        Physics.ActiveEvents.COLLISION_EVENTS
        | Physics.ActiveEvents.CONTACT_FORCE_EVENTS
      );
      obj.onCollision = collider.onCollision;
      obj.onContactForce = collider.onContactForce;
    }
    else if (collider.onCollision) {
      colliderDesc.setActiveEvents(
        Physics.ActiveEvents.COLLISION_EVENTS
      );
      obj.onCollision = collider.onCollision;
    }
    else if (collider.onContactForce) {
      colliderDesc.setActiveEvents(
        Physics.ActiveEvents.CONTACT_FORCE_EVENTS
      );
      obj.onContactForce = collider.onContactForce;
    }

    obj.collider = physCore.createCollider(colliderDesc, obj.rigidBody);

    const ecsCore = store.state.ecs.core;

    if (rigidBody === 'dynamic' || collider.sensor) {
      addComponent(ecsCore, DynamicPhysicsComponent, obj.eid);
      DynamicPhysicsComponent.objectId[obj.eid] = obj.id;
    }

    // Add collider handle for lookup during collision time
    DynamicPhysicsComponent.objForColliderHandle[obj.collider.handle] = obj.id;

    if (collider.density && (collider.mass || collider.massProperties)) {
      throw new Error('Can\'t set both density and mass on collider');
    }

    // Update collider for each valid key
    Object.keys(collider)
      .filter((key) => colliderSettings.includes(key))
      .forEach((key) => {

        const colliderFunc = `set${key.slice(0, 1).toUpperCase() + key.slice(1)}`;

        if (key === 'massProperties') {
          const val = collider[key];
          obj.collider[colliderFunc](
            val.mass,
            val.centerOfMass,
            val.principalAngularInertia,
            val.angularInertiaLocalFrame
          );
        }
        else {
          obj.collider[colliderFunc](collider[key]);
        }
      });
  }
}
