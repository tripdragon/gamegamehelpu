
// import { Vector3 } from 'three';
import { CheapPool } from 'alexandria/utils/cheapPool.js';
import { ImportedModels } from './importedModels.js';
import { AnimationPool } from './animationPool.js';
import { SceneGrapth } from './sceneGrapth.js';
import { PlanningBoard } from './planningBoard.js';
import { Levels } from './levels.js';


// #TODO: fix some of these and GameGrapth to be arrays instead
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



// others
