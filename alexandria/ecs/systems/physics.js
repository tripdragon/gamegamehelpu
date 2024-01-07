import { store } from 'alexandria/store';

export default function physicsSystem(world) {

  // Step the simulation forward
  store.state.physics.world.step();

  return world;
}
