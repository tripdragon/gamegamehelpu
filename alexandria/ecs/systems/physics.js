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
// const eventQueue = new Physics.EventQueue(true);

let rigidBodyPos;
let colliderRotation;

export default function physicsSystem(core) {

  const ents = physQuery(core);

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
  store.state.physics.core.step();
  // store.state.physics.core.step(eventQueue);

  // eventQueue.drainCollisionEvents((handle1, handle2, started) => {
  //   /* Handle the contact event. */
  //   console.log(handle1, handle2, started);
  // });

  // eventQueue.drainContactEvents((handle1, handle2, contactStarted) => {
  //   events.push({ type: "contact", handle1, handle2, contactStarted });
  // });
  // eventQueue.drainIntersectionEvents((handle1, handle2, intersecting) => {
  //   events.push({ type: "intersection", handle1, handle2, intersecting });
  // });

  return core;
}
