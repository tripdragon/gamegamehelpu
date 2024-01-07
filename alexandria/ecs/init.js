// Good example repo
// https://codesandbox.io/p/devbox/bitecs-threejs-kb20g?file=%2Fsrc%2Fpipeline.ts%3A5%2C1

import {
  createWorld,
  addEntity
} from 'bitecs';

// movementSystem is for non-physics-based motion
// NOTE movementSystem is commented out til
// we decide we want to use it
// import movementSystem from './systems/movement';

import { store } from 'alexandria/store';

export default function init() {

  const core = createWorld();
  core.time = { delta: 0, elapsed: 0, then: performance.now() };

  const eid = addEntity(core);
  core.eid = eid;

  store.setState({ ecs: { core } });
}
