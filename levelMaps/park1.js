
import LevelMap from "./levelMap";

import {fakeStore as _a} from "../logics/fakeStore";

import { DirectionalLight, AmbientLight,
  BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, PlaneGeometry,
  DoubleSide
} from 'three';



class Entities{
  entities = [];
  owner = null;
  constructor(owner){
    this.owner = owner;
  }
  add(item){
    this.entities.push(item);
    item.owner = this.owner;
  }
  run(){
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].update(this.owner);
    }
  }
}

// have to solve .owner out as just .this

class Enty {
  owner = null;
  name = '';
  update(){}
  constructor(name = ""){
    this.name = name;
  }
}

class Move extends Enty {
  update(){
    this.owner.position.x += 0.01;
    // console.log(this.name);
  }
}

class Spin extends Enty {
  update(){
    this.owner.rotation.y += 0.01;
  }
}

// function Meep(name, func){
//   debugger
//   const aa = new Enty();
//   aa.update = function(){
// 
//     // func;
//   }
//   return aa;
// }
// 
// function tacos(mmm){
//   console.log("fooowsh");
//   debugger
// }


// Meep( "moop", () => { this.owner.position.z += 0.1 } )


export class Park1 extends LevelMap{
  
  // parent;
  
  constructor(parent){
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
    this.add( cube );
    cube.name = "sldkfndsf";
    
    _a.animationPool.add(cube);
    
    // cube.update = function(){
    //   // debugger
    //   this.position.x += 0.01;
    //   console.log(this.name);
    // }
    
    
    cube.entities = new Entities(cube);
    cube.entities.add(new Move());
    cube.entities.add(new Spin());
    // debugger
    // cube.entities.add( Meep( "moop", () => { this.owner.position.z += 1 } ) );
    
    // debugger
    
    
    
    
  }
  
  
  
}
