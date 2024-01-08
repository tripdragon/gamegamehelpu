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

    rigidBodyPos = object3D.rigidBody.translation();
    console.log('rigidBodyPos', rigidBodyPos);
    // object3D.rigidBody.translation(bb);

    // console.log('rigidBodyPos', rigidBodyPos);

    // object3D.position.copy(bb);
    object3D.position.copy(rigidBodyPos);

    // object3D.position.y = -2;


    // This also makes the floor disappear
    // object3D.position.set(new Vector3(
    //   0, 0, 0
    // ));

    colliderRotation = object3D.collider.rotation();
    // console.log('colliderRotation', colliderRotation);

    // TODO FIX SO IT NOT DISAPPEAR OR W/E
    // object3D.quaternion.set(new Quaternion(
    //   colliderRotation.x,
    //   colliderRotation.y,
    //   colliderRotation.z,
    //   colliderRotation.w
    // ));

    object3D.updateMatrix();
  }

  // Step the simulation forward
  store.state.physics.core.step();

  return core;
}
