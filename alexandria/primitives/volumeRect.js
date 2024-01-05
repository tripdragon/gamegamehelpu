

import { Object3D, Box3, BoxGeometry, MeshBasicMaterial, Mesh, BufferAttribute } from 'three';


export class VolumeRect extends Object3D {
  
  bounds = new Box3();
  
  boxMesh;
  boxMeshWire;
  
  // See note file for derive
  // 0~3 right side
  // 4~7 left side
  // 0,7
  sharedVertices = [[[0,1,2],[33,34,35],[51,52,53]],[[3,4,5],[27,28,29],[60,61,62]],[[6,7,8],[39,40,41],[57,58,59]],[[9,10,11],[45,46,47],[66,67,68]],[[12,13,14],[24,25,26],[63,64,65]],[[15,16,17],[30,31,32],[48,49,50]],[[18,19,20],[42,43,44],[69,70,71]],[[21,22,23],[36,37,38],[54,55,56]]]
  
  constructor(size){
    super();
    // const indices = new Uint16Array( [ 0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7 ] );
    // const indices = new Uint16Array( [0, 11, 17, 1, 9, 20, 2, 13, 19, 3, 15, 22, 4, 8, 21, 5, 10, 16, 6, 14, 23, 7, 12, 18, 4, 8, 21, 1, 9, 20, 5, 10, 16, 0, 11, 17, 7, 12, 18, 2, 13, 19, 6, 14, 23, 3, 15, 22, 5, 10, 16, 0, 11, 17, 7, 12, 18, 2, 13, 19, 1, 9, 20, 4, 8, 21, 3, 15, 22, 6, 14, 23] );
    
    // need the reverse winding order or coulter clockwise to get the faces pointing outwards
    // the initial vertice positions look to be
    // 0 -------- 1
    // |
    // |
    // 2
    // with vol.addVectice(2,0,0,1) moving bottom to z
    // pattern is i i+2 i+1, then i+1 of previous, i+2 i+3
    // const indices = new Uint16Array( [
    //   // 0, 2, 1, 1, 2, 3, 
    //   // 4,6,5, 5,6,7
    //   7,9,8
    // ] );
    // const indices = new Uint16Array( [0, 2, 1, 1, 2, 3, 3, 5, 4, 4, 5, 6, 6, 8, 7, 7, 8, 9, 9, 11, 10, 10, 11, 12, 12, 14, 13, 13, 14, 15, 15, 17, 16, 16, 17, 18, 18, 20, 19, 19, 20, 21, 21, 23, 22, 22, 23, 24, 24, 26, 25, 25, 26, 27, 27, 29, 28, 28, 29, 30, 30, 32, 31, 31, 32, 33, 33, 35, 34, 34, 35, 36] );
    
    // const indices = new Uint16Array( [0, 11, 17, 1, 9, 20, 2, 13, 19, 3, 15, 22, 4, 8, 21, 5, 10, 16, 6, 14, 23, 7, 12, 18, 4, 8, 21, 1, 9, 20, 5, 10, 16, 0, 11, 17, 7, 12, 18, 2, 13, 19, 6, 14, 23, 3, 15, 22, 5, 10, 16, 0, 11, 17] );
// index = 8
// for (var i = 0; i < 4; i++) {
//   vol.addVectice(index,0,0,-1)
// }

// vol.addVectice(8,0,1,-1)
// vol.addVectice(9,0,1,-1)
// vol.addVectice(10,0,1,-1)
// vol.addVectice(11,0,1,-1)

size = 2;
    const geometry = new BoxGeometry( size, size, size ); 
    // geometry.setIndex( new BufferAttribute( indices, 1 ) );

    {
      const material = new MeshBasicMaterial( {color: 0x0000ff, transparent: true, opacity: 0.5} );
      this.boxMesh = new Mesh( geometry, material );
      this.add( this.boxMesh );
    }
    {
      // driving the boxMesh geometry should drive this
      // const geometry = new BoxGeometry( size, size, size ); 
      const material = new MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
      this.boxMeshWire = new Mesh( geometry, material );
      this.add( this.boxMeshWire );
    }
  }
  
  getOffset(index){
    return index * 3;
  }
  // setVectice(index, x,y,z){
  //   const pp = this.boxMesh.geometry.attributes.position.array;
  //   pp[index*3] = x;
  //   pp[index*3+1] = y;
  //   pp[index*3+2] = z;
  //   this.boxMesh.geometry.attributes.position.needsUpdate = true;
  // }
  // addVectice(index, x,y,z){
  //   const pp = this.boxMesh.geometry.attributes.position.array;
  //   pp[index*3] += x;
  //   pp[index*3+1] += y;
  //   pp[index*3+2] += z;
  //   this.boxMesh.geometry.attributes.position.needsUpdate = true;
  // }
  
  setVectice(index, x,y,z){
    const pp = this.boxMesh.geometry.attributes.position.array;
    const vert = this.sharedVertices[index];
    pp[vert[0][0]] = x;
    pp[vert[0][1]] = y;
    pp[vert[0][2]] = z;
    pp[vert[1][0]] = x;
    pp[vert[1][1]] = y;
    pp[vert[1][2]] = z;
    pp[vert[2][0]] = x;
    pp[vert[2][1]] = y;
    pp[vert[2][2]] = z;
    this.boxMesh.geometry.attributes.position.needsUpdate = true;
  }
  // in teh vinacular of add offset value to vertice
  addVectice(index, x,y,z){
    const pp = this.boxMesh.geometry.attributes.position.array;
    const vert = this.sharedVertices[index];
    // console.log(vert);
    pp[vert[0][0]] += x;
    pp[vert[0][1]] += y;
    pp[vert[0][2]] += z;
    pp[vert[1][0]] += x;
    pp[vert[1][1]] += y;
    pp[vert[1][2]] += z;
    pp[vert[2][0]] += x;
    pp[vert[2][1]] += y;
    pp[vert[2][2]] += z;
    this.boxMesh.geometry.attributes.position.needsUpdate = true;
  }
  
//   vol.boxMesh.geometry.attributes.position.array
//   itemSize * numVertices
// 
//   positionAttribute.needsUpdate = true;
//   line.geometry.computeBoundingBox();
// line.geometry.computeBoundingSphere();
// 
  // get min {
  //   return this.bounds.min;
  // }
  // set min(x,y,z){
  //   this.bounds.mix.set(x,y,z);
  // }
  
  select(){
    
  }
  deselect(){
    
  }
  
  
  
}
