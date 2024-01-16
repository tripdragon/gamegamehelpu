import {
  Vector3,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  DirectionalLight,
  AmbientLight,
  AxesHelper,
  PCFSoftShadowMap,
  Color,
  SRGBColorSpace,
  Group
} from 'three';

import { store } from 'alexandria/store';
// import {Levels} from 'alexandria/grapths/levels.js';
import {GameGrapth} from 'alexandria/grapths/gameGrapth.js';

// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// levels
import { Park1 } from 'levelMaps/park1';
import * as PhysPark from 'levelMaps/physPark';

export default () => {

  const scene = new Scene();
  scene.background = new Color();
  // early optimisations, see readme #code: scene28475#
  scene.matrixAutoUpdate = false;

  const helpersGroup = new Group();
  scene.add(helpersGroup);
  helpersGroup.matrixAutoUpdate = false;

  const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.05, 1000 );
  // camera.position.z = 5;
  // camera.position.fromArray(store.state.camPosition || [3.302152734555017, 2.150391493963814, 3.8012990005129046]);
  camera.position.fromArray( [3.302152734555017, 2.150391493963814, 3.8012990005129046] );
  // camera.position.fromArray(store.state.camPosition || [3, 14, 15]);
  camera.lookAt(new Vector3());

  const renderer = new WebGLRenderer({antialias:true});
  // renderer.antialias = true; https://stackoverflow.com/a/34786482
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.shadowMap.enabled = true;
  // renderer.outputEncoding = sRGBEncoding;
  // renderer.outputColorSpace = SRGBColorSpace;

  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
  // renderer.powerPreference = 'high-performance';
  document.body.appendChild( renderer.domElement );

  // moving to gameGrapth, this couples it but its so basic of a need
  // const orbitControls = new OrbitControls( camera, renderer.domElement );

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  window.addEventListener('resize', onWindowResize, false);

  // setup state and other

  // #TODO: fix some of these and GameGrapth to be arrays instead
  // #code: gaaame238 #
  store.setState({
    // this part belongs somewhere else
    // so its not so stashed away in this file
    game: new GameGrapth({
      renderer: renderer,
      domElement: renderer.domElement,
      scene: scene,
      camera: camera,
      // controls: controls,
      // cameraControls: controls,
      helpersGroup: helpersGroup
    })
  });

  const st = store.state.game;

  st.buildCameraControls();

  // lights moved into levels

  // temporary level swapper, need something more complex so we can load multi on start
  const queryLvl = window.location.search
    .replace('?', '')
    .split('lvl=')[1] || 'park1';

  let level;
  let levelName;

  switch (queryLvl) {
  case 'physPark':
    level = new PhysPark.Level();
    levelName = 'physLevel';
    break;
  case 'park1':
    level = new Park1();
    levelName = 'park1';
    break;
  }

  scene.add(level);
  st.levels.add(level, levelName);
  st.currentLevelMap = level;

  // const parkLevel = new Park1();
  // scene.add(parkLevel);
  // st.levels.add(parkLevel, "Park1");

  // st.currentLevelMap = parkLevel;

  // st.levels.changeLevel("Park1");

  const axesHelper = new AxesHelper( 5 );
  // scene.add( axesHelper );

  st.buildTransformWidget('translate');
  st.buildTransformWidget('rotate');
  st.buildTransformWidget('scale');

  st.buildPhysicsGroup();

  // renderloop moved to later process
};
