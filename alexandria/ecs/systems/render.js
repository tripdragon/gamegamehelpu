import { store } from 'alexandria/store';

export default function renderSystem(core) {

  const st = store.state.game;
  // Call each render callback in the renderPool before THREE renders
  st.renderPool.forEach((func) => func(core));
  st.renderer.render(st.scene, st.camera);

  return core;
}
