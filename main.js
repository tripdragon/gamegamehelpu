import './style-3d-fix.css';

import { store } from 'alexandria/store';
import Initializers from 'alexandria/initializers/index';

import { fish } from 'narf';

import { patchObject3D_CM } from 'alexandria/initializers/patchObject3D';

const init = async () => {

  patchObject3D_CM();

  await Initializers(store);

  console.log('store', store);

  fish();
};

init();
