// NOTE movementSystem is commented out til
// we decide we want to use it

import { defineQuery } from 'bitecs';

import {
  TransformComponent,
  VelocityComponent
} from '../components';

export const movementQuery = defineQuery([TransformComponent, VelocityComponent]);

export default function movementSystem(core) {
  const { time: { delta } } = core;
  const ents = movementQuery(core);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    // const obj3d = world.objects.get(e);

    // TransformComponent.rotation.x[e] += 0.0001 * delta;
    // TransformComponent.rotation.y[e] += 0.003 * delta;
    // TransformComponent.rotation.z[e] += 0.0005 * delta;

    TransformComponent.position.x[eid] += VelocityComponent.x[eid] * delta;
    TransformComponent.position.y[eid] += VelocityComponent.y[eid] * delta;
    TransformComponent.position.z[eid] += VelocityComponent.z[eid] * delta;
  }

  return core;
}
