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

export const sleepingPhysQuery = defineQuery([SleepingPhysicsComponent]);

export default function sleepingPhysicsSystem(core) {

  const ents = sleepingPhysQuery(core);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    const object3D = store.state.game.scene.getObjectById(
      SleepingPhysicsComponent.objectId[eid]
    );

    // Put back in the main physics system if it wakes up
    if (!object3D?.rigidBody.isSleeping()) {
      removeComponent(core, SleepingPhysicsComponent, eid);
      delete SleepingPhysicsComponent.objectId[eid];
      DynamicPhysicsComponent.objectId[eid] = object3D.id;
      addComponent(core, DynamicPhysicsComponent, eid);
    }
  }

  return core;
}
