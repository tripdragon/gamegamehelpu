
// import { Vector3 } from 'three';
import { CheapPool } from 'alexandria/utils/cheapPool.js';


// will need guid?
// what distinguishes the model with a same name an a reload?
export class ImportedModels extends CheapPool{
  constructor(){
    super();
  }
  // how this will handle same named files that have no name is a mystery....
  findModelByName(search) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].name === search) {
        return this[i];
      }
    }
    return null;
  }
}
