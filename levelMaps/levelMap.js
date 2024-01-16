import {Group} from 'three';

import { CheapPool } from 'alexandria/utils/cheapPool.js';

import { CubeMesh } from 'alexandria/primitves/cubeMesh.js';
import { PlaneMesh } from 'alexandria/primitves/planeMesh.js';
import { SphereMesh } from 'alexandria/primitves/sphereMesh.js';
import { RectangularPrismMesh } from 'alexandria/primitves/rectangularPrismMesh.js';



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
  
  // the initial here are primitives
  sources = {
    cubeMesh : new CubeMesh({size:0.1}),
    planeMesh : new PlaneMesh(),
    rectangularPrismMesh : new RectangularPrismMesh(),
    sphereMesh : new SphereMesh({radius:0.2})
  }
  
  
  constructor(){
    super();
    this.lights = new Group();
    this.add( this.lights );
  }
  
  fetchObject(sourceName){
    const gg = this.sources[sourceName];
    if(gg){
      return gg.clone();
    }
  }
  
  loadFromData(data){
    const gg = new Group();
    gg.name = data.name;
    debugger
    
    for (var i = 0; i < data.objects.length; i++) {
      const pick = data.objects[i];
      const mm = this.fetchObject(pick.sourceName);
      if(mm){
        mm.position.copy(pick.position);
        mm.scale.copy(pick.scale);
        mm.rotation.copy(pick.rotation);
        mm.name = pick.name;
        gg.add(mm);
        mm.updateMatrix();
      }
    }
    
  }
  
  
}
