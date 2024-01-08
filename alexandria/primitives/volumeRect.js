import { Object3D, Box3, BoxGeometry, MeshBasicMaterial, Mesh, BufferAttribute } from 'three';

import { TransformControls } from 'three/addons/controls/TransformControls.js';

export class VolumeRect extends Object3D {

  store = null;

  bounds = new Box3();

  boxMesh;
  boxMeshWire;

  // TransformControls assigns widget to an object
  // so we need proxy objects
  minObject = new Object3D();
  maxObject = new Object3D();

  minTransformWidget;// = new TransformControls( this.camera, this.domElement );

  maxTransformWidget;

  // See note file for derive
  // 0~3 right side
  // 4~7 left side
  // 0,7
  // 8 length of pairs of 3 position attributes
  sharedVertices = [[[0,1,2],[33,34,35],[51,52,53]],[[3,4,5],[27,28,29],[60,61,62]],[[6,7,8],[39,40,41],[57,58,59]],[[9,10,11],[45,46,47],[66,67,68]],[[12,13,14],[24,25,26],[63,64,65]],[[15,16,17],[30,31,32],[48,49,50]],[[18,19,20],[42,43,44],[69,70,71]],[[21,22,23],[36,37,38],[54,55,56]]]
  // topDown stragety 0~3 counterclockwise top left
  // same for bottom
  // 0 top [2]
  // 1 : t [3]
  // 2 : bottom [2]
  // 3 : b [3]
  // 4: t 0
  // 5: t 1
  // 6 : b 0
  // 7 : b 1
  reorderSharedVertices = { top: [4,5,0,1], bottom: [6,7,2,3] };

  shareArray = [0,0,0];
  // this is intended as read only
  readVertAtSharedIndex(index, arrayIn){
    const pp = vol.boxMesh.geometry.attributes.position.array;
    let tempArray = arrayIn || this.shareArray;
    tempArray[0] = pp[this.sharedVertices[index][0][0]];
    tempArray[1] = pp[this.sharedVertices[index][0][1]];
    tempArray[2] = pp[this.sharedVertices[index][0][2]];
    return tempArray;
  }


  // top view, counter clockwise, top left, bottom left, bottom right, top left
  // this refers to sharedVertices
  // test with addVectice(2,1,1,1)
  // then setSide()
  sides = {
    top : [4,5,0,1],
    bottom : [6,7,2,3],
    left : [4,6,7,5],
    right : [0,2,3,1],
    front : [4,6,3,1],
    back : [5,7,2,0]
  }
  minMaxMappings = {
    // 0 is root, next are x,y,z, opisite side plane
    min : [6,3,4,7,2],
    max : [0,5,2,1,4]
  }


  constructor({size=1,store}={}){
    super();

    if(store) this.store = store;

    if (store) {
      this.add(this.minObject);
      this.add(this.maxObject);
      this.minTransformWidget = new TransformControls( store.state.game.camera, store.state.game.domElement );
      this.maxTransformWidget = new TransformControls( store.state.game.camera, store.state.game.domElement );
      this.add(this.minTransformWidget);
      this.add(this.maxTransformWidget);
      this.minTransformWidget.space = "local";
      this.minTransformWidget.attach(this.minObject);
      // this.minObject.position.y = -1;



      this.minTransformWidget.isNotStatic = true;
      // there are many nested objects in the transformControls class
      this.minTransformWidget.traverse((item) => {
        item.isNotStatic = true;
      });
      this.minObject.isNotStatic = true;

      this.minTransformWidget.store = store;
      this.minTransformWidget.addEventsHandleCamera();

      // _a.state.game.controls.enabled = false
      // store.state.game.widgetsGroup.setAutoMatrixAll(false, true);
    }


    // IF we built the geometry ourselves we could set the indices to 8 points
    // but since we cheaped out and spent more time to figure out the sorting wellll
    // wee the mess that there is !!!

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

    // size = 12;
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
  setMinMax(type,x,y,z){
    const maps = this.minMaxMappings[type];

    // cant for loop this, each axis has its own space
    // root moves in all axis
    this.setVectice(maps[0],x,y,z);
    // each axis does not move in its axis but the others
    // x goes in y and z
    // y : x and z
    // z : x and y
    // op : y

    // x
    this.offsetVectice(maps[1], "y", y);
    this.offsetVectice(maps[1], "z", z);
    // y
    this.offsetVectice(maps[2], "x", x);
    this.offsetVectice(maps[2], "z", z);
    // z
    this.offsetVectice(maps[3], "x", x);
    this.offsetVectice(maps[3], "y", y);
    //op
    this.offsetVectice(maps[4], "y", y);
  }
  setMax(x,y,z){
    this.setMinMax("max",x,y,z);
  }
  setMin(x,y,z){
    this.setMinMax("min",-x,-y,-z);
  }


  // @side refer to this.sides
  addSide(side, x,y,z){
    for (var i = 0; i < 4; i++) this.addVectice(this.sides[side][i],x,y,z);
  }
  setSide(side, x,y,z){
    for (var i = 0; i < 4; i++) this.setVectice(this.sides[side][i],x,y,z);
  }

  offsetSide(side, val){
    if (side==="top") {
      for (var i = 0; i < 4; i++) this.addVectice(this.sides.top[i],0,val,0);
    }
    else if (side==="bottom") {
      for (var i = 0; i < 4; i++) this.addVectice(this.sides.bottom[i],0,-val,0);
    }
    else if (side==="left") {
      for (var i = 0; i < 4; i++) this.addVectice(this.sides.left[i],0,0,0);
    }
    else if (side==="right") {

    }
    else if (side==="sdgdfg") {

    }
  }

  setSide(side, val){
    if (side==="top") for (var i = 0; i < 4; i++) this.offsetVectice(this.sides.top[i],"y",val);
    else if (side==="bottom") for (var i = 0; i < 4; i++) this.offsetVectice(this.sides.bottom[i],"y",-val);
    else if (side==="left") for (var i = 0; i < 4; i++) this.offsetVectice(this.sides.left[i],"x",-val);
    else if (side==="right") for (var i = 0; i < 4; i++) this.offsetVectice(this.sides.right[i],"x",val);
    else if (side==="front") for (var i = 0; i < 4; i++) this.offsetVectice(this.sides.front[i],"z",-val);
    else if (side==="back") for (var i = 0; i < 4; i++) this.offsetVectice(this.sides.back[i],"z",val);

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
  offsetVectice(index, axis, val){
    const pp = this.boxMesh.geometry.attributes.position.array;
    const vert = this.sharedVertices[index];
    let ii = 0;

    if(axis === "x"){ ii = 0;}
    else if(axis === "y"){ ii = 1;}
    else if(axis === "z"){ ii = 2;}

    pp[vert[0][ii]] = val;
    pp[vert[1][ii]] = val;
    pp[vert[2][ii]] = val;

    this.boxMesh.geometry.attributes.position.needsUpdate = true;
  }
  // getVertice(index){
  //   const pp = this.boxMesh.geometry.attributes.position.array;
  //   const vert = this.sharedVertices[index];
  //   return
  //   pp[vert[0][0]] += x;
  //   pp[vert[0][1]] += y;
  //   pp[vert[0][2]] += z;
  //   return
  // }

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
