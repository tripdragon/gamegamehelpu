// Interesting example here syncing some babylon stuff w/ rapier
// https://playcode.io/1528902

import { defineQuery, removeComponent } from 'bitecs';

import { store } from 'alexandria/store';

import { DynamicPhysicsComponent } from 'alexandria/ecs/components';

const physQuery = defineQuery([DynamicPhysicsComponent]);

export default function outOfBoundsCheckSystem(core) {

  const ents = physQuery(core);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    const st = store.state.game;

    const object3D = st.scene.getObjectById(
      DynamicPhysicsComponent.objectId[eid]
    );

    const outOfBounds = (
      Math.abs(object3D?.position.y) > st.outOfBounds
      || Math.abs(object3D?.position.x) > st.outOfBounds
      || Math.abs(object3D?.position.z) > st.outOfBounds
    );

    if (outOfBounds) {
      removeComponent(core, DynamicPhysicsComponent, eid);
      delete DynamicPhysicsComponent.objectId[eid];
      object3D.superDelete();
    }
  }

  return core;
}