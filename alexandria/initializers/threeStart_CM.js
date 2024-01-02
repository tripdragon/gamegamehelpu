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
  SRGBColorSpace
} from 'three';

import { store } from 'alexandria/store';
// import {Levels} from 'alexandria/grapths/levels.js';
import {GameGrapth} from 'alexandria/grapths/gameGrapth.js';

// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';





import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// levels
import {Park1} from 'levelMaps/park1';

export default () => {

  const scene = new Scene();
  scene.background = new Color();
  
  // early optimisations, see readme #code: scene28475#
  scene.matrixAutoUpdate = false;
  
  const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  // camera.position.z = 5;
  camera.position.fromArray([0.9625265375798292, 4.0272857200013625, 4.984509277416068]);
  camera.lookAt(new Vector3());

  const renderer = new WebGLRenderer({antialias:true});
  // renderer.antialias = true; https://stackoverflow.com/a/34786482
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.shadowMap.enabled = true;
  // renderer.outputEncoding = sRGBEncoding;
  // renderer.outputColorSpace = SRGBColorSpace;

  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
  // renderer.powerPreference = "high-performance";
  document.body.appendChild( renderer.domElement );

  const controls = new OrbitControls( camera, renderer.domElement );

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  
  window.addEventListener( 'resize', onWindowResize, false );


  // #TODO: fix some of these and GameGrapth to be arrays instead
  // #code: gaaame238 #
  store.setState({
    // this part belongs somewhere else
    // so its not so stashed away in this file
    game: new GameGrapth({
        renderer: renderer,
        domElement : renderer.domElement,
        scene: scene,
        camera: camera,
        controls: controls,
        // currentLevelMap : parkLevel,
        // levels : levelsCache
      })
  });
  
  const st = store.state.game;


  // lights moved into levels
  //
  // const ambientLight = new AmbientLight();
  // ambientLight.intensity = 1.01;
  // scene.add(ambientLight);
  // 
  // const directionalLight = new DirectionalLight();
  // directionalLight.castShadow = true;
  // directionalLight.position.set(2.5, 4, 0);
  // directionalLight.intensity = 2.7;
  // // directionalLight.color.setHex(0xffff80);
  // directionalLight.color.setHex(0xfffff);
  // scene.add(directionalLight);
  // 
  // //Set up shadow properties for the light
  // directionalLight.shadow.mapSize.width = 512;
  // directionalLight.shadow.mapSize.height = 512;
  // directionalLight.shadow.camera.near = 0.5;
  // directionalLight.shadow.camera.far = 500;
  // 
  
  // const levelsCache = new Levels();

  const parkLevel = new Park1();
  scene.add(parkLevel);
  st.levels.add(parkLevel);
  
  st.currentLevelMap = parkLevel;

  const axesHelper = new AxesHelper( 5 );
  // scene.add( axesHelper );


  // // #TODO: fix some of these and GameGrapth to be arrays instead
  // // #code: gaaame238 #
  // store.setState({
  //   // this part belongs somewhere else
  //   // so its not so stashed away in this file
  //   game: new GameGrapth({
  //       renderer: renderer,
  //       domElement : renderer.domElement,
  //       scene: scene,
  //       camera: camera,
  //       controls: controls,
  //       currentLevelMap : parkLevel,
  //       levels : levelsCache
  //     })
  // });
  // 
  // renderloop moved to later process
  
  
};
