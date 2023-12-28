
import LevelMap from './levelMap';

// import {fakeStore as _a} from '../logics/fakeStore';
import {fakeStore as _b} from '../logics/fakeStore';

import { DirectionalLight, AmbientLight,
  BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, PlaneGeometry,
  DoubleSide, AxesHelper
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
    
  
    const ambientLight = new AmbientLight();
    ambientLight.intensity = 1.01;
    this.add(ambientLight);

    const directionalLight = new DirectionalLight();
    directionalLight.castShadow = true;
    // directionalLight.position.set(2.5, 4, 0);
    directionalLight.position.set(2.5, 4, 12);
    directionalLight.intensity = 2.7;
    // directionalLight.color.setHex(0xffff80);
    directionalLight.color.setHex(0xfffff);
    this.add(directionalLight);

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;


    
    {
      const geometry = new PlaneGeometry( 1, 1 );
      const material = new MeshStandardMaterial( {color: 0xfffff} );
      const floor = new Mesh( geometry, material );
      floor.scale.setScalar(12);
      floor.rotation.set(-Math.PI/2,0,0);
      floor.receiveShadow = true;
      this.add( floor );
      window.floor = floor;
    }

    const cube = new Cube({size: 0.2,debug: true, color:0xffffff});
    cube.position.y = 1;
    
    // cube.update = function(){
    //   // debugger
    //   this.position.x += 0.01;
    //   console.log(this.name);
    // }
      

    this.add( cube );
    cube.name = 'sldkfndsf';
    
    _b.animationPool.add(cube);
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
      
      _b.animationPool.add(cube);
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
