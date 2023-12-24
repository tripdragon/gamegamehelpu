
import LevelMap from "./levelMap";

import {fakeStore as _a} from "../logics/fakeStore";

import { DirectionalLight, AmbientLight,
  BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, PlaneGeometry,
  DoubleSide, AxesHelper
} from 'three';


import {Entities, Enty, Move, Spin, KeyWalk, Meep } from "../entities/basicEntites";

export class Park1 extends LevelMap{

  constructor(){
    super();
    this.init();
  }
  
  init(){
    
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
    
    const geometry = new BoxGeometry( 1, 1, 1 );
    const material = new MeshStandardMaterial( { color: 0x00ff00 } );
    const cube = new Mesh( geometry, material );
    cube.castShadow = true;
    cube.position.y = 1;
    const axesHelper = new AxesHelper( 1 );
    cube.add( axesHelper );
    
    this.add( cube );
    cube.name = "sldkfndsf";
    
    _a.animationPool.add(cube);
    
    // cube.update = function(){
    //   // debugger
    //   this.position.x += 0.01;
    //   console.log(this.name);
    // }
    
    
    cube.entities = new Entities(cube);
    // cube.entities.add(new Move());
    cube.entities.add(new Spin(cube));
    
    // now just some arbitary builder
    // cube.entities.add( Meep( "moop", function(){ this.position.z += 0.01 } ) );
    
    cube.entities.add(new KeyWalk(cube));
    
    
    
    
  }
  
  
  
}
