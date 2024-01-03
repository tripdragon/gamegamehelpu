


import { Mesh, BoxGeometry, MeshStandardMaterial, AxesHelper} from 'three';


export class Cube extends Mesh{


  constructor({size = 1, color = 0x00ff00, debug = false}){
    
    const geometry = new BoxGeometry( size, size, size);
    const material = new MeshStandardMaterial( { color: color } );
    // const cube = new Mesh( geometry, material );
    
    super(geometry, material);
    
    this.castShadow = true;
    // cube.position.y = 1;
    if (debug) {
      const axesHelper = new AxesHelper( 1 );
      this.add( axesHelper );
    }
    
    this.name = 'cubey';
    
    // pick.matrixWorldAutoUpdate
    // debugger
    this.matrixAutoUpdate = false;

    
  }
  
}
