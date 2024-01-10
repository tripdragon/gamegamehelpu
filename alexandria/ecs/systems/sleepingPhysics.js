// Interesting example here syncing some babylon stuff w/ rapier
// https://playcode.io/1528902

// This system doesn't go in the gamePipeline,
// it should go on a much slower tick than raf

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

const sleepingPhysQuery = defineQuery([SleepingPhysicsComponent]);

export default function sleepingPhysicsSystem(core) {

  const ents = sleepingPhysQuery(core);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    const object3D = store.state.game.scene.getObjectById(
      SleepingPhysicsComponent.objectId[eid]
    );

    // Put back in the main physics system if it wakes up
    if (!object3D?.rigidBody.isSleeping()) {
      // TODO figure out why we have to both addComponent / removeComponent and set the eid on .objectId
      removeComponent(core, SleepingPhysicsComponent, eid);
      delete SleepingPhysicsComponent.objectId[eid];
      addComponent(core, DynamicPhysicsComponent, eid);
      DynamicPhysicsComponent.objectId[eid] = object3D.id;
    }
  }

  // Step the simulation forward
  store.state.physics.core.step();

  return core;
}
