import {
  Vector3,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  DirectionalLight,
  AmbientLight,
  AxesHelper,
  PCFSoftShadowMap,
  Color
} from 'three';

import { store } from 'alexandria/store';
import { renderLoop } from 'logics/renderLoop';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// import {fakeStore as _b} from 'logics/fakeStore';
import {Park1} from 'levelMaps/park1';

export default () => {

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
  directionalLight.position.set(2.5, 4, 0);
  directionalLight.intensity = 2.7;
  // directionalLight.color.setHex(0xffff80);
  directionalLight.color.setHex(0xfffff);
  scene.add(directionalLight);

  //Set up shadow properties for the light
  directionalLight.shadow.mapSize.width = 512;
  directionalLight.shadow.mapSize.height = 512;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;



  const parkLevel = new Park1();
  scene.add(parkLevel);
  // add to scene grapth

  const axesHelper = new AxesHelper( 5 );
  scene.add( axesHelper );

  // store.renderer = renderer;
  // store.scene = scene;
  // store.camera = camera;
  // store.controls = controls;
  //

  store.setState({
    game: {
      renderer: renderer,
      scene: scene,
      camera: camera,
      controls: controls
    }
  });

  // debugger
  // renderLoop.bind(store);
  // Kickoff render loop!
  renderLoop(0, store);
};
