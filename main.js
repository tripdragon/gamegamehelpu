import { store } from './alexandria/store';
import Initializers from './alexandria/initializers/index';

import { fish } from './alexandria/tacos/narf.js';
// import {fish} from 'narf';




// import * as THREE from 'three';
import {Vector3, Scene, WebGLRenderer, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh} from 'three';



// import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// const controls = new OrbitControls( camera, renderer.domElement );
// const loader = new GLTFLoader();


const _a = {};

const init = async () => {

  await Initializers(store);

  console.log('store', store);


  const scene = new Scene();
  const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  const renderer = new WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new OrbitControls( camera, renderer.domElement );

  const geometry = new BoxGeometry( 1, 1, 1 );
  const material = new MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new Mesh( geometry, material );
  scene.add( cube );
  camera.position.z = 5;

  _a.renderer = renderer;
  _a.scene = scene;
  _a.camera = camera;
  _a.controls = controls;
  _a.cube = cube;

  fish();
  animate();
  
};

init();


function animate() {
	requestAnimationFrame( animate );
  
	_a.renderer.render( _a.scene, _a.camera );
  _a.controls.update();
}
