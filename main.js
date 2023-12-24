import { store } from './alexandria/store';
import Initializers from './alexandria/initializers/index';

import { fish } from './alexandria/tacos/narf.js';
// import {fish} from 'narf';




// import * as THREE from 'three';
import {Vector3, Scene, WebGLRenderer, PerspectiveCamera, 
  DirectionalLight, AmbientLight,
  BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, AxesHelper, PCFSoftShadowMap, Color} from 'three';



// import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// const controls = new OrbitControls( camera, renderer.domElement );
// const loader = new GLTFLoader();

import {fakeStore as _a} from "./logics/fakeStore";
import {Park1} from "./levelMaps/park1";





const init = async () => {

  await Initializers(store);

  console.log('store', store);
  
  window._a = _a;


  const scene = new Scene();
  scene.background = new Color();
  
  const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  // camera.position.z = 5;
  camera.position.fromArray([0.9625265375798292, 4.0272857200013625, 4.984509277416068]);
  camera.lookAt(new Vector3());

  const renderer = new WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
  document.body.appendChild( renderer.domElement );
  
  const controls = new OrbitControls( camera, renderer.domElement );

  
  const ambientLight = new AmbientLight();
  ambientLight.intensity = 1.01;
  scene.add(ambientLight);
  
  const directionalLight = new DirectionalLight();
  directionalLight.castShadow = true;
  directionalLight.position.set(2.5, 4, 5);
  directionalLight.intensity = 1.7;
  // directionalLight.color.setHex(0xffff80);
  directionalLight.color.setHex(0xfffff);
  scene.add(directionalLight);

  //Set up shadow properties for the light
  directionalLight.shadow.mapSize.width = 512; // default
  directionalLight.shadow.mapSize.height = 512; // default
  directionalLight.shadow.camera.near = 0.5; // default
  directionalLight.shadow.camera.far = 500; // default
  
  
  
  const parkLevel = new Park1();
  scene.add(parkLevel);
  // add to scene grapth
  
  const axesHelper = new AxesHelper( 5 );
  scene.add( axesHelper );
  
  _a.renderer = renderer;
  _a.scene = scene;
  _a.camera = camera;
  _a.controls = controls;
  // _a.cube = cube;

  fish();
  animate();
  
};

init();


function animate() {
	requestAnimationFrame( animate );
  
	_a.renderer.render( _a.scene, _a.camera );
  _a.controls.update();
  
  // debugger
  // would like this is be a subclass of array
  for (var i = 0; i < _a.animationPool.cache.length; i++) {
    // _a.animationPool.cache[i].update();
    let pick = _a.animationPool.cache[i];
    pick.entities.run();
  }
  
}
