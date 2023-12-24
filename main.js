import { store as Store } from './alexandria/store';
import Initializers from './alexandria/initializers/index';

// import {fish} from './alexandria/tacos/narf.js';
import {fish} from 'narf';

fish();

Initializers(Store);
