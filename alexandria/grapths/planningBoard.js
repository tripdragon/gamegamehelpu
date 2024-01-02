

import { CheapPool } from 'alexandria/utils/cheapPool.js';

export class PlanningBoard extends CheapPool{
  constructor(){
    super();
  }
  cachuplevel(){
    return cachuplevel_CM(this);
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
