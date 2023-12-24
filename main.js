import { store } from './alexandria/store';
import Initializers from './alexandria/initializers/index';

// import {fish} from './alexandria/tacos/narf.js';
// import {fish} from 'narf';

Initializers(store);

console.log('store', store);

// fish();
