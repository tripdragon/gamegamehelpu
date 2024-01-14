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

const internals = {
  extraPipelines: new Map()
};

const sleepingPhysicsTick = 300;
const outOfBoundsCheckTick = 1000;

// eslint-disable-next-line no-unused-vars
export function initGameLoop() {

  // Kick off the slow tick loop for sleeping physics
  const sleepingPhysicsPipeline = pipe(
    sleepingPhysicsSystem
  );

  // Slow tick to remove out-of-bounds objects
  const outOfBoundsCheckPipeline = pipe(
    outOfBoundsCheckSystem
  );

  const setGamePipeline = () => {

    // Game system loop!
    const loop = [
      store.state.game.timeSystem && timeSystem,
      store.state.game.physics && physicsSystem,
      renderSystem
    ].filter((x) => !!x);

    internals.gamePipeline = pipe(...loop);
    console.log('gamePipeline UPDATED', loop);

    // Extras (non-raf loop)

    // Run sleeping physics tick to check for wake
    internals.runPipelineOnCondition({
      pipeline: sleepingPhysicsPipeline,
      interval: sleepingPhysicsTick,
      condition: store.state.game.physics
    });

    // If object goes out of bounds, remove it
    internals.runPipelineOnCondition({
      pipeline: outOfBoundsCheckPipeline,
      interval: outOfBoundsCheckTick,
      condition: !!store.state.game.outOfBounds
    });
  };

  setGamePipeline();

  store.subscribe('game.physics', setGamePipeline);
  store.subscribe('game.outOfBounds', setGamePipeline);

  // Kickoff render loop
  internals.renderLoop();
}

internals.renderLoop = () => {

  // const st = store.getState().game; // this spams with objects
  const st = store.state.game;

  if (useStats && stats === null) {
    stats = new Stats();
    document.body.appendChild(stats.dom);
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

  requestAnimationFrame(internals.renderLoop);

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

internals.runPipelineOnCondition = ({ pipeline, interval, condition }) => {

  clearInterval(internals.extraPipelines.get(pipeline));

  if (condition) {
    internals.extraPipelines.set(
      pipeline,
      setInterval(() => pipeline(store.state.ecs.core), interval)
    );
  }
};
