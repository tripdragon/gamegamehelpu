
import { CheapPool } from 'alexandria/utils/cheapPool.js';

export class Levels extends CheapPool{
  
  levelsObjects = {}
  scene = null;
  
  
  constructor({scene}={}){
    super();
    this.scene = scene;
  }
  
  add(item, levelName){
    super.add(item);
    this.levelsObjects[levelName] = item;
  }
  
  changeLevel(levelName){
    if( this.scene && this.levelsObjects[levelName] ){
      
      // console.log(this.levelsObjects[levelName]);
      for (var i = 0; i < this.length; i++) {
        this[i].visible = false;
      }
      this.levelsObjects[levelName].visible = true;

      // const level = new PhysPark.Level();
      // // const level = new Park1();
      // scene.add(level);
      // st.levels.add(level);
      // 
      // st.currentLevelMap = level;


    }
  }
  
}
