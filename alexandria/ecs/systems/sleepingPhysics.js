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
const physQuery = defineQuery([DynamicPhysicsComponent]);

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
      // The gamePipeline watches the store.state.game.physicsOn value and adapts.
      // If physics is off and an ent wakes up, turn physics back on
      const _ents = physQuery(core);
      if (!store.state.game.physicsOn && _ents.length === 1) {
        store.setState({ game: { physicsOn: true } });
      }
    }
  }

  return core;
}
