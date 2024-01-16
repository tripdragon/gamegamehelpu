import {Group} from 'three';

import { CheapPool } from 'alexandria/utils/cheapPool.js';


// // import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//
// const controls = new OrbitControls( camera, renderer.domElement );
// const loader = new GLTFLoader();

export default class LevelMap extends Group {
  isLevel = true;
  lights;
  sunLight = null;
  
  loadedGroups = new CheapPool();
  
  constructor(){
    super();
    this.lights = new Group();
    this.add( this.lights );
  }
  
  loadFromData(data){
    const gg = new Group();
    
  }
  
  
}
