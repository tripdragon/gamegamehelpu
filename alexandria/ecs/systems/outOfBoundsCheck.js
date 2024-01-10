// Interesting example here syncing some babylon stuff w/ rapier
// https://playcode.io/1528902

import {
  defineQuery,
  addComponent,
  removeComponent
} from 'bitecs';

import { store } from 'alexandria/store';

import {
  DynamicPhysicsComponent,
  SleepingPhysicsComponent
} from 'alexandria/ecs/components';

export const objQuery = defineQuery([DynamicPhysicsComponent]);

export default function physicsSystem(core) {

  const ents = objQuery(core);

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
      console.log('zlog DynamicPhysicsComponent.objectId', DynamicPhysicsComponent.objectId);
      // if (store.state.game) {
      //   //
      // }
      continue;
    }

    rigidBodyPos = object3D.rigidBody.translation();

    object3D.position.copy(rigidBodyPos);

    colliderRotation = object3D.collider.rotation();

    object3D.quaternion.copy(colliderRotation);

    object3D.updateMatrix();
  }

  // Step the simulation forward
  store.state.physics.core.step();

  return core;
}
