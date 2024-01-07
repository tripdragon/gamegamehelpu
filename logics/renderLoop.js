import { pipe } from 'bitecs';

import timeSystem from 'alexandria/ecs/systems/time';
import physicsSystem from 'alexandria/ecs/systems/physics';
import renderSystem from 'alexandria/ecs/systems/render';

import Stats from 'three/addons/libs/stats.module.js';
var stats = null;
var useStats = false;

import { store } from 'alexandria/store';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
let composer = null, renderPass, saoPass;
var useComposer = true;

// Game system loop!
const gamePipeline = pipe(
  timeSystem,
  physicsSystem,
  // movementSystem,
  renderSystem
);

// eslint-disable-next-line no-unused-vars
export function renderLoop(delta) {

  // const st = store.getState().game; // this spams with objects
  const st = store.state.game;

  if (useStats && stats === null) {
    stats = new Stats();
    document.body.appendChild( stats.dom );
  }

  // OY
  // if(useComposer && composer === null){
  //   console.log("><><>");
  //   composer = new EffectComposer( st.renderer );
  //   renderPass = new RenderPass( st.scene, st.camera );
  //   composer.addPass( renderPass );
  //   saoPass = new SAOPass( st.scene, st.camera );
  //   saoPass.saoIntensity = 0.001;
  //   saoPass.saoScale = 0.001;
  //   composer.addPass( saoPass );
  //   const outputPass = new OutputPass();
  //   composer.addPass( outputPass );
  // }

  requestAnimationFrame(renderLoop);

  // if(stats){
  //   stats.begin();
  //   st.renderer.render( st.scene, st.camera );
  //   stats.end();
  // }
  // else {
  //   if (useComposer && composer) {
  //     composer.render();
  //     // console.log("¿");
  //   }
  //   else {
  //     st.renderer.render( st.scene, st.camera );
  //   }
  // }

  st.controls.update();

  // Main render pipeline
  gamePipeline(store.state.ecs.core);

  // would like this is be a subclass of array
  // for (var i = 0; i < store.animationPool.cache.length; i++) {
  //   // store.animationPool.cache[i].update();
  //   let pick = store.animationPool.cache[i];
  //   pick.entities.run();
  // }

  // TODO can move this into an animationSystem and fit into the above pipeline()
  for (var i = 0; i < st.animationPool.length; i++) {
    // store.animationPool.cache[i].update();
    let pick = st.animationPool[i];
    pick.entities.run();
    // we are forcing everything off in main, so make sure to update here
    // #code: scene28475#
    pick.updateMatrix();
  }
}
