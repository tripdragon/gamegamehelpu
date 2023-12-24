import { store } from './alexandria/store';
import Initializers from './alexandria/initializers/index';

import { fish } from './alexandria/tacos/narf.js';
// import {fish} from 'narf';

const init = async () => {

  await Initializers(store);

  console.log('store', store);

  fish();
};

init();
