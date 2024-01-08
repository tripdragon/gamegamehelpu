// Interesting example here syncing some babylon stuff w/ rapier
// https://playcode.io/1528902

import { defineQuery } from 'bitecs';
import { store } from 'alexandria/store';
import { Vector3, Quaternion } from 'three';
import { DynamicPhysicsComponent } from 'alexandria/ecs/components';

export const physQuery = defineQuery([DynamicPhysicsComponent]);

let rigidBodyPos;
let colliderRotation;
var bb = new Vector3();

export default function physicsSystem(core) {

  const ents = physQuery(core);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    const object3D = store.state.game.scene.getObjectById(
      DynamicPhysicsComponent.objectId[eid]
    );

    // Bail if rigidBody is sleeping
    if (object3D.rigidBody.isSleeping()) {
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
