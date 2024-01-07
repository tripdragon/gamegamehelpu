
import LevelMap from './levelMap';


import { store } from 'alexandria/store';


import { DirectionalLight, AmbientLight,
  BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, PlaneGeometry,
  DoubleSide, AxesHelper, TextureLoader, RepeatWrapping, SRGBColorSpace, CameraHelper,
  HemisphereLight
} from 'three';


import {Entities, Enty, Move, Spin, KeyWalk, Meep } from '../entities/basicEntites';

import {Cube} from "../alexandria/primitives/cube";
import {randomInRange} from "alexandria/math/mathMore";

export class Park1 extends LevelMap{

  constructor(){
    super();
    this.init();
  }

  init(){

    const st = store.state.game;
    // debugger

    const ambientLight = new AmbientLight();
    ambientLight.intensity = 2.01;
    this.lights.add(ambientLight);

    const sunLight = new DirectionalLight();
    sunLight.castShadow = true;
    // sunLight.position.set(2.5, 4, 0);
    // sunLight.position.set(2.5, 4, 12);
    // sunLight.position.set(1, 1, 0);
    sunLight.position.copy({x: 1.2, y: 1, z: 0.2});
    sunLight.intensity = 4.7;
    // sunLight.color.setHex(0xffff80);
    sunLight.color.setHex(0xfffff);
    this.lights.add(sunLight);

    //Set up shadow properties for the light
    sunLight.shadow.mapSize.width = 512 * 2;
    sunLight.shadow.mapSize.height = 512 * 2;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;

    // see link for more https://stackoverflow.com/a/56015860
    // and need it to be in 3d space instead of vector space
    sunLight.position.multiplyScalar(5);

    // need a larger size for shadows
    var side = 8;
    sunLight.shadow.camera.top = side;
    sunLight.shadow.camera.bottom = -side;
    sunLight.shadow.camera.left = side;
    sunLight.shadow.camera.right = -side;

    // var shadowHelper = new CameraHelper( sunLight.shadow.camera );
    // this.add( shadowHelper );

    this.sunLight = sunLight;

    //
    // const hemiLight = new HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
    // this.add(hemiLight);

    {
      const geometry = new PlaneGeometry( 1,1 );
      const material = new MeshStandardMaterial( {color: 0x4fff0f} );
      // const material = new MeshStandardMaterial( {color: 0xffffff} );
      const floor = new Mesh( geometry, material );
      floor.scale.setScalar(12);
      floor.rotation.set(-Math.PI/2,0,0);
      floor.receiveShadow = true;
      this.add(floor);
      // floor.init({ physics: { rigidBody: 'fixed' } });
      floor.init({ physics: { rigidBody: 'dynamic' } });
      window.floor = floor;

      // const texture = new TextureLoader().load('./textures/myrthe-van-tol-grass-texture.jpeg' );
      const texture = new TextureLoader().loadAsync('./textures/myrthe-van-tol-grass-texture.jpeg' );
      texture.then((tex) => {
        //console.log(tex);
        tex.repeat.setScalar(8);
        tex.wrapS = tex.wrapT = RepeatWrapping;
        tex.needsUpdate = true;
        tex.colorSpace = SRGBColorSpace; // washed out otherwise
        material.map = tex;
        material.needsUpdate = true;
      });

    }


return

    const cube = new Cube({size: 0.2,debug: true, color:0xffffff});
    cube.position.y = 1;

    // cube.update = function(){
    //   // debugger
    //   this.position.x += 0.01;
    //   console.log(this.name);
    // }


    this.add( cube );
    cube.name = 'sldkfndsf';

    st.animationPool.add(cube);
    cube.entities = new Entities(cube);

    cube.entities.add(new Spin(cube));

    // cube.entities.add(new Move());
    // now just some arbitary builder
    // cube.entities.add( Meep( "moop", function(){ this.position.z += 0.01 } ) );

    cube.entities.add(new KeyWalk(cube, 0.01, 0.01));


    for (var i = 0; i < 22; i++) {


      const cube = new Cube({size: 0.2,debug: true, color:Math.random()* 0xffffff});


      this.add( cube );
      cube.name = 'sldkfndsf' + i;

      st.animationPool.add(cube);
      cube.entities = new Entities(cube);

      cube.entities.add(new Spin(cube));

      cube.position.set(randomInRange(4, -4), 1, randomInRange(4, -4))
      cube.rotation.y = Math.random() * Math.PI * 2;

      // cube.entities.add(new Move());
      // now just some arbitary builder
      // cube.entities.add( Meep( "moop", function(){ this.position.z += 0.01 } ) );

      cube.entities.add(new KeyWalk(cube, 0.01, 0.01));


    }




  }



}
