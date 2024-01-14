// Interesting example here syncing some babylon stuff w/ rapier
// https://playcode.io/1528902

// TODO check how the r3f peeps handled collision events here
// https://github.com/pmndrs/react-three-rapier/blob/main/packages/react-three-rapier/src/components/Physics.tsx

import {
  defineQuery,
  addComponent,
  removeComponent
} from 'bitecs';

import Physics from '@dimforge/rapier3d-compat';

import { store } from 'alexandria/store';

import {
  DynamicPhysicsComponent,
  SleepingPhysicsComponent
} from 'alexandria/ecs/components';

const physQuery = defineQuery([DynamicPhysicsComponent]);

let rigidBodyPos;
let colliderRotation;

const internals = {};

// Reusable stuff
// let

export default function physicsSystem(core) {

  const ents = physQuery(core);

  internals.eventQueue = internals.eventQueue || new Physics.EventQueue(false);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    const object3D = store.state.game.scene.getObjectById(
      DynamicPhysicsComponent.objectId[eid]
    );

    // Bail if rigidBody is sleeping
    // and swap object to sleepingPhysicsSystem
    if (object3D.rigidBody.isSleeping()) {
      removeComponent(core, DynamicPhysicsComponent, eid);
      delete DynamicPhysicsComponent.objectId[eid];
      SleepingPhysicsComponent.objectId[eid] = object3D.id;
      addComponent(core, SleepingPhysicsComponent, eid);
      continue;
    }

    rigidBodyPos = object3D.rigidBody.translation();
    object3D.position.copy(rigidBodyPos);

    colliderRotation = object3D.collider.rotation();
    object3D.quaternion.copy(colliderRotation);

    object3D.updateMatrix();

    // Some code in the docs about character collision system
    // DOCS
    // https://rapier.rs/docs/user_guides/javascript/character_controller
    // let characterController = world.createCharacterController(0.01);
    // characterController.computeColliderMovement(collider, desiredMovementVector);

    // // After the collider movement calculation is done, we can read the
    // // collision events.
    // for (let i = 0; i < characterController.numComputedCollisions(); i++) {
    //     let collision = characterController.computedCollision(i);
    //     // Do something with that collision information.
    // }

    // And this for elsewhere
    // let characterController = world.createCharacterController(0.01);
    // // Enable the automatic application of impulses to the dynamic bodies
    // // hit by the character along its path.
    // characterController.setApplyImpulsesToDynamicBodies(true);
  }

  // Step the simulation forward
  // TODO supposedly supposed to pass an EventQueue here but it's not working
  // store.state.physics.core.step();
  store.state.physics.core.step(internals.eventQueue);

  internals.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
    /* Handle the collision event. */
    const obj1 = store.state.game.scene.getObjectById(DynamicPhysicsComponent.objIdForColliderHandle[handle1]);
    const obj2 = store.state.game.scene.getObjectById(DynamicPhysicsComponent.objIdForColliderHandle[handle2]);

    const collisionInfo = obj1.collider.contactCollider(obj2.collider);

    const baseEvtProps = {
      obj1,
      obj2,
      collisionInfo,
      started
    };

    if (started) {
      store.state.physics.core.contactPair(
        obj1.collider.object,
        obj2.collider.object,
        (manifold, flipped) => {

          obj1?.onCollision({ ...baseEvtProps, manifold, flipped });
          obj2?.onCollision({ ...baseEvtProps, manifold, flipped });
        }
      );
    }
    else {
      obj1?.onCollision(baseEvtProps);
      obj2?.onCollision(baseEvtProps);
    }
  });

  internals.eventQueue.drainContactForceEvents((handle1, handle2, started) => {
    /* Handle the contact force event. */
    const obj1 = DynamicPhysicsComponent.objIdForColliderHandle[handle1];
    const obj2 = DynamicPhysicsComponent.objIdForColliderHandle[handle2];

    const baseEvtProps = {
      obj1,
      obj2,
      started
    };

    if (started) {
      store.state.physics.core.contactPair(
        obj1.collider.object,
        obj2.collider.object,
        (manifold, flipped) => {

          obj1?.onContactForce({ ...baseEvtProps, manifold, flipped });
          obj2?.onContactForce({ ...baseEvtProps, manifold, flipped });
        }
      );
    }
    else {
      obj1?.onContactForce(baseEvtProps);
      obj2?.onContactForce(baseEvtProps);
    }
  });

  return core;
}

internals.parseSourceEvents = (core, collider) => {

  const rigidBodyHandle = collider?.parent()?.handle;

  const rigidBody =
    rigidBodyHandle !== undefined
      ? core.getRigidBody(rigidBodyHandle)
      : undefined;

  const source = {
    collider,
    rigidBody
  };

  return source;
};
