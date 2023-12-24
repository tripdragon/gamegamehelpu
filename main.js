import './style-3d-fix.css';

import { store } from 'alexandria/store';
import Initializers from 'alexandria/initializers/index';

import { renderLoop } from 'logics/renderLoop';

import { fish } from 'narf';

import { patchObject3D_CM } from 'alexandria/initializers/patchObject3D';

const init = async () => {

  patchObject3D_CM();

  await Initializers(store);
  
  // Kickoff render loop!
  renderLoop(0, store);

  console.log('store', store);

  fish();
};

init();
