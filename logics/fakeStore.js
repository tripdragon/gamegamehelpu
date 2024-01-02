
// // #gaaame238#

import { Vector3 } from 'three';
import { CheapPool } from 'alexandria/utils/cheapPool.js';


// this acts as a scene grapth
// export class CheapPool extends Array{
//   // cache = [];
//   add(item){
//     this.push(item);
//   }
// }


class AnimationPool extends CheapPool{
  constructor(){
    super();
  }
}

class SceneGrapth extends CheapPool{
  constructor(){
    super();
  }
}

class PlanningBoard extends CheapPool{
  constructor(){
    super();
  }
  cachuplevel(){
    return cachuplevel_CM(this);
  }
}



export class Levels extends CheapPool{
  constructor(){
    super();
  }
}

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



// // import {fakeStore as _b} from 'logics/fakeStore';
// need to work this out
export const fakeStore = {
  camera : null,
  scene : null,
  renderer : null,
  animationPool : new AnimationPool(),
  sceneGrapth : new SceneGrapth(),
  planningBoard : new PlanningBoard(),
  currentLevelMap : null,
  levels : new Levels()
}

// export const fakeStore = new Game({
//   animationPool : new AnimationPool(),
//   sceneGrapth : new SceneGrapth(),
//   planningBoard : new PlanningBoard(),
//   currentLevelMap : null,
//   levels : new Levels()
// });
// skdfms




// #TODO: fix some of these and GameGrapth to be arrays instead
// #TODO: replace fakeStore fully for this namely animationPool where referenced for fakestore
// export class Game{
// #code: gaaame238 #
export class GameGrapth{
  constructor(props){
    this.camera = props.camera || null,
    this.scene = props.scene || null,
    this.renderer = props.renderer || null,
    this.domElement = props.domElement || null,
    this.controls = props.controls || null,
    this.animationPool = new AnimationPool(),
    this.sceneGrapth = new SceneGrapth(),
    this.planningBoard = new PlanningBoard(),
    this.currentLevelMap = props.currentLevelMap || null,
    this.levels = props.levels || new Levels(),
    this.importedModels = props.importedModels || new ImportedModels()
  }
}





// function buildFloorPlan(){
  
    // save feature
    // // let lMap = store.state.game.planningBoard;
    function cachuplevel_CM(lMap){
      class dat{
        position=new Vector3()
        rotation=new Vector3()
        scale=new Vector3()
        name="";
        copy(wobj){
          this.position.copy(wobj.position);
          this.scale.copy(wobj.scale);
          this.rotation.copy(wobj.rotation);
          this.name = wobj.name;
          this.compress(this.position);
          this.compress(this.scale);
        }
        compress(vec){
          vec.x = +Number.parseFloat(vec.x).toFixed(3);
          vec.y = +Number.parseFloat(vec.y).toFixed(3);
          vec.z = +Number.parseFloat(vec.z).toFixed(3);
        }
      }
      
      function dats(){
        this.wobjs=[];
      }
      
      let rr = new dats();
      // let lMap = store.state.game.currentLevelMap;
      // let lMap = store.state.game.planningBoard;
      for (var i = 0; i < lMap.length; i++) {
        let gg = new dat();gg.copy(lMap[i]);
        rr.wobjs.push( gg );
      }
      return rr;
    }
