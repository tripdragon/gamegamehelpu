
import {Group} from 'three';

// // import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 
// const controls = new OrbitControls( camera, renderer.domElement );
// const loader = new GLTFLoader();


export default class LevelMap extends Group{
  isLevel = true;
  constructor(){
    super();
  }
}
