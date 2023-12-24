
import { store } from 'alexandria/store';

import {fakeStore as _b} from 'logics/fakeStore';

// eslint-disable-next-line no-unused-vars
export function renderLoop(delta) {
  
  requestAnimationFrame(renderLoop);
  
  // debugger
  // const st = store.getState().game; // this spams with objects
  const st = store.state.game;

  st.renderer.render( st.scene, st.camera );
  st.controls.update();

  
  // would like this is be a subclass of array
  // for (var i = 0; i < store.animationPool.cache.length; i++) {
  //   // store.animationPool.cache[i].update();
  //   let pick = store.animationPool.cache[i];
  //   pick.entities.run();
  // }
  
  
  for (var i = 0; i < _b.animationPool.cache.length; i++) {
    // store.animationPool.cache[i].update();
    let pick = _b.animationPool.cache[i];
    pick.entities.run();
  }
}
