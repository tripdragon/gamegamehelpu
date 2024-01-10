import { pipe } from 'bitecs';

import timeSystem from 'alexandria/ecs/systems/time';
import physicsSystem from 'alexandria/ecs/systems/physics';
import sleepingPhysicsSystem from 'alexandria/ecs/systems/sleepingPhysics';
import renderSystem from 'alexandria/ecs/systems/render';
import outOfBoundsCheckSystem from 'alexandria/ecs/systems/outOfBoundsCheck';

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

const internals = {};

const sleepingPhysicsTick = 300;

// eslint-disable-next-line no-unused-vars
export function initGameLoop() {

  // Kick off the slow tick loop for sleeping physics
  const sleepingPhysicsPipeline = pipe(
    sleepingPhysicsSystem
  );

  const setGamePipeline = () => {

    // Game system loop!
    const loop = [
      store.state.game.timeSystemOn && timeSystem,
      store.state.game.physicsOn && physicsSystem,
      renderSystem
    ].filter((x) => !!x);

    internals.gamePipeline = pipe(...loop);

    clearInterval(internals.sleepingPhysicsInterval);

    if (store.state.game.physicsOn) {
      internals.sleepingPhysicsInterval = setInterval(() => {

        // Run sleeping physics tick to check for wake
        sleepingPhysicsPipeline(store.state.ecs.core);
      }, sleepingPhysicsTick);
    }
  };

  setGamePipeline();

  store.subscribe('game.physicsOn', setGamePipeline);

  // Kickoff render loop
  renderLoop();
}

// Function hoisting FTW
function renderLoop(delta) {

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

  st.cameraControls.main.update();

  // Main game pipeline
  internals.gamePipeline(store.state.ecs.core);

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
