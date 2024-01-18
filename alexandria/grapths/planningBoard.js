

import { CheapPool } from 'alexandria/utils/cheapPool.js';

// what is added here via .add()???
// an object from tools pallete
export class PlanningBoard extends CheapPool{
  constructor(){
    super();
  }
  cachuplevel(){
    // return cachuplevel_CM(this);
    let rr = new Dats();
    // let lMap = store.state.game.currentLevelMap;
    // let lMap = store.state.game.planningBoard;
    for (var i = 0; i < this.length; i++) {
      let gg = new Dat();
      gg.copy(this[i]);
      rr.push( gg );
    }
    return rr;
  }
}



// function buildFloorPlan(){

// save feature
// // let lMap = store.state.game.planningBoard;
// function cachuplevel_CM(lMap){
//   let rr = new Dats();
//   // let lMap = store.state.game.currentLevelMap;
//   // let lMap = store.state.game.planningBoard;
//   for (var i = 0; i < lMap.length; i++) {
//     let gg = new Dat();gg.copy(lMap[i]);
//     rr.wobjs.push( gg );
//   }
//   return rr;
// }



class Dats extends CheapPool{

}

class Dat{
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
