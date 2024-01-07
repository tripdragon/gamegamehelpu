// Good example repo
// https://codesandbox.io/p/devbox/bitecs-threejs-kb20g?file=%2Fsrc%2Fpipeline.ts%3A5%2C1

import {
  createWorld,
  addComponent,
  addEntity,
  pipe
} from 'bitecs';

import timeSystem from './systems/time';
import physicsSystem from './systems/physics';
// Non-physics-based motion
// NOTE movementSystem is commented out til
// we decide we want to use it
// import movementSystem from './systems/movement';

import * as Components from './components';

import { store } from 'alexandria/store';

// Game system loop!
const pipeline = pipe(
  timeSystem,
  physicsSystem,
  // movementSystem
);

export default function init() {

  const world = createWorld();
  world.time = { delta: 0, elapsed: 0, then: performance.now() };

  const eid = addEntity(world);
  world.eid = eid;

  // Add all components exported from './components'
  Object.values(Components).forEach((Component) => {
    addComponent(world, Component, eid);
  });

  store.setState({ ecs: { world } });

  setInterval(() => {
    pipeline(world)
  }, 16);
}
