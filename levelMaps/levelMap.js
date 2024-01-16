import {Group, Vector3} from 'three';

import { CheapPool } from 'alexandria/utils/cheapPool.js';

import { CubeMesh } from 'alexandria/primitives/cubeMesh.js';
import { PlaneMesh } from 'alexandria/primitives/planeMesh.js';
import { SphereMesh } from 'alexandria/primitives/sphereMesh.js';
import { RectangularPrismMesh } from 'alexandria/primitives/rectangularPrismMesh.js';

import { store } from 'alexandria/store';


// // import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//
// const controls = new OrbitControls( camera, renderer.domElement );
// const loader = new GLTFLoader();

const vv1 = new Vector3();

export default class LevelMap extends Group {
  isLevel = true;
  lights;
  sunLight = null;
  
  loadedGroups = new CheapPool();
  
  // the initial here are primitives
  sources = {
    cubeMesh : new CubeMesh({size:1}),
    planeMesh : new PlaneMesh(),
    rectangularPrismMesh : new RectangularPrismMesh(),
    sphereMesh : new SphereMesh({radius:1})
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
    
    const st = store.state.game;
    
    if (data.camera) {
      const cam = data.camera;
      // need to fix to handle perspective and ortho . type
      // and .controlType
      st.camera.position.fromArray(cam.position);
      st.camera.rotation.fromArray(cam.rotation);
      if (st.camera.lookAt) st.camera.lookAt(vv1.fromArray(cam.lookAt));
      st.camera.updateMatrix();
    }
    
    const gg = new Group();
    gg.name = data.name;
    this.add(gg);
    this.loadedGroups.add(gg);
    
    for (var i = 0; i < data.objects.length; i++) {
      const pick = data.objects[i];
      const mm = this.fetchObject(pick.sourceName);
      if(mm){
        mm.position.fromArray(pick.position);
        mm.scale.fromArray(pick.scale);
        mm.rotation.fromArray(pick.rotation);
        mm.name = pick.name;
        if(mm.material && pick.material && pick.material.clone){
          mm.material = mm.material.clone();
        }
        if(mm.material && pick.material && pick.material.color){
          mm.material.color.setHex(pick.material.color);
          mm.material.needsUpdate = true;
        }
        gg.add(mm);
        mm.updateMatrix();
      }
    }
    
    gg.updateWorldMatrix();
    
  }
  
  
}
