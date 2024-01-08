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

import { Box3, Vector3, Box3Helper } from 'three';

import { loadModelAsync } from 'alexandria/utils/loadModel';

import { VolumeRect } from 'alexandria/primitives/volumeRect';

import GUI from 'lil-gui';


export class Park1 extends LevelMap{

  constructor(){
    super();
    this.init();
  }

  async init(){
    // const init = async () => {

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


loadereee3894();

    buildLilGui(store.state.game);

    let gg = new VolumeRect();
    store.state.game.scene.add(gg);
    gg.position.y = 1.4;
    // gg.init({ physics: { rigidBody: 'dynamic' } });
    window.vol = gg;
    console.log(vol);
    

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







function buildLilGui(gameConfig){

  // const _o = this.store.state.game;
  // const _o = store.state.game;

  const gui = new GUI({width: 240 });
  // gui.add( document, 'fish' );

  const obj = {

  	// myBoolean: true,
  	// myString: 'lil-gui',
  	// myNumber: 1,

    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
    front: 1,
    back: 1,
    
    minx: 1,
    miny: 1,
    minz: 1,
    maxx: 1,
    maxy: 1,
    maxz: 1,
    

  	widgetTranslate: function() { gameConfig.transformWidget.mode = "translate" },
  	widgetRotate: function() { gameConfig.transformWidget.mode = "rotate" },
  	widgetScale: function() { gameConfig.transformWidget.mode = "scale" }

  }

  // gui.add( obj, 'myBoolean' ); 	// checkbox
  // gui.add( obj, 'myString' ); 	// text field
  // 
  // gui.add( obj, 'top',0,4 ).onChange( x => { vol.setSide("top",x) } );
  // gui.add( obj, 'bottom',0,4 ).onChange( x => { vol.setSide("bottom",x) } );
  // gui.add( obj, 'left',0,4 ).onChange( x => { vol.setSide("left",x) } );
  // gui.add( obj, 'right',0,4 ).onChange( x => { vol.setSide("right",x) } );
  // gui.add( obj, 'front',0,4 ).onChange( x => { vol.setSide("front",x) } );
  // gui.add( obj, 'back',0,4 ).onChange( x => { vol.setSide("back",x) } );
  
  const min = new Vector3(-0.5,-0.5,-0.5);
  const max = new Vector3(0.5,0.5,0.5);
  function djkfngkldfnmgh() {
    
    // min
    // :o

    // val = -1
    
    vol.setVectice(vol.reorderSharedVertices.bottom[0],min.x,min.y,min.z)

    // y
    vol.offsetVectice(vol.reorderSharedVertices.bottom[1], "y", min.y);
    vol.offsetVectice(vol.reorderSharedVertices.bottom[2], "y", min.y);
    vol.offsetVectice(vol.reorderSharedVertices.bottom[3], "y", min.y);

    // here we already need the y of the top, not to += it
    // vol.setVectice(vol.reorderSharedVertices.top[0],val,val,val)

    var v0 = []
    vol.readVertAtSharedIndex(vol.reorderSharedVertices.bottom[0], v0)
    // opisite
    var v1 = []
    vol.readVertAtSharedIndex(vol.reorderSharedVertices.top[2], v1)

    // top edge
    vol.offsetVectice(vol.reorderSharedVertices.top[0], "x", v0[0]);
    vol.offsetVectice(vol.reorderSharedVertices.top[0], "z", v0[2]);
    vol.offsetVectice(vol.reorderSharedVertices.top[0], "y", v1[1]);

    // x edge
    vol.offsetVectice(vol.reorderSharedVertices.bottom[3], "z", v0[2]);
    vol.offsetVectice(vol.reorderSharedVertices.top[3], "z", v0[2]);

    // y
    vol.offsetVectice(vol.reorderSharedVertices.top[3], "y", v1[1]);

    // z edge
    vol.offsetVectice(vol.reorderSharedVertices.bottom[1], "x", v0[0]);
    vol.offsetVectice(vol.reorderSharedVertices.bottom[1], "z", v1[2]);

    vol.offsetVectice(vol.reorderSharedVertices.top[1], "x", v0[0]);
    vol.offsetVectice(vol.reorderSharedVertices.top[1], "y", v1[1]);

    // :x

    // max
    // :o

    // val = 1
    vol.setVectice(vol.reorderSharedVertices.top[2],max.x,max.y,max.z)



    // y
    vol.offsetVectice(vol.reorderSharedVertices.top[0], "y", max.y);
    vol.offsetVectice(vol.reorderSharedVertices.top[1], "y", max.y);
    vol.offsetVectice(vol.reorderSharedVertices.top[3], "y", max.y);

    var v0 = []
    vol.readVertAtSharedIndex(vol.reorderSharedVertices.top[2], v0)
    // opisite
    var v1 = []
    vol.readVertAtSharedIndex(vol.reorderSharedVertices.bottom[0], v1)

    // bottom edge
    vol.offsetVectice(vol.reorderSharedVertices.bottom[2], "x", v0[0]);
    vol.offsetVectice(vol.reorderSharedVertices.bottom[2], "z", v0[2]);
    vol.offsetVectice(vol.reorderSharedVertices.bottom[2], "y", v1[1]);


    // x edge
    vol.offsetVectice(vol.reorderSharedVertices.bottom[3], "x", v0[0]);
    vol.offsetVectice(vol.reorderSharedVertices.top[3], "x", v0[0]);

    // z edge
    vol.offsetVectice(vol.reorderSharedVertices.bottom[1], "z", v0[2]);
    vol.offsetVectice(vol.reorderSharedVertices.bottom[1], "x", v1[0]);

    vol.offsetVectice(vol.reorderSharedVertices.top[1], "z", v0[2]);
    vol.offsetVectice(vol.reorderSharedVertices.top[1], "x", v1[0]);

  }
  // 
  gui.add( obj, 'minx',0,4 ).onChange( x => { min.x = -x; djkfngkldfnmgh(); } );
  gui.add( obj, 'miny',0,4 ).onChange( x => { min.y = -x; djkfngkldfnmgh(); } );
  gui.add( obj, 'minz',0,4 ).onChange( x => { min.z = -x; djkfngkldfnmgh(); } );
  
  gui.add( obj, 'maxx',0,4 ).onChange( x => { max.x = x; djkfngkldfnmgh(); } );
  gui.add( obj, 'maxy',0,4 ).onChange( x => { max.y = x; djkfngkldfnmgh(); } );
  gui.add( obj, 'maxz',0,4 ).onChange( x => { max.z = x; djkfngkldfnmgh(); } );
  // 
  
  // 
  // gui.add( obj, 'minx',0,4 ).onChange( x => { min.setScalar(-x); djkfngkldfnmgh(); } );
  // gui.add( obj, 'miny',0,4 ).onChange( x => { min.y = -x; djkfngkldfnmgh(); } );
  // gui.add( obj, 'minz',0,4 ).onChange( x => { min.z = -x; djkfngkldfnmgh(); } );
  // 
  // gui.add( obj, 'maxx',0,4 ).onChange( x => { max.setScalar(x); djkfngkldfnmgh(); } );
  // gui.add( obj, 'maxy',0,4 ).onChange( x => { max.y = x; djkfngkldfnmgh(); } );
  // gui.add( obj, 'maxz',0,4 ).onChange( x => { max.z = x; djkfngkldfnmgh(); } );
  // 
  // 
  

  gui.add( obj, 'widgetTranslate' ); 	// button
  gui.add( obj, 'widgetRotate' ); 	// button
  gui.add( obj, 'widgetScale' ); 	// button
}

// function attachLeftShelf() {
//   let gg = new Notlilgui();
//   gg.attach();
//   gg.addItem({imageurl:"./icons/cursor_a_NFT_cash_mices.png"});
//   gg.addItem({imageurl:"./icons/tree_NFT_NFT_NFT_upon.png"});
//   gg.addItem({imageurl:"./icons/bench_NFT_apples_upon.png"});
//   // gg.addItem();
//   // gg.addItem();
//   // gg.addItem();
//   // gg.addItem();
//   // for (var i = 0; i < 40; i++) {
//   //   gg.addItem();
//   // }
// }




async function loadereee3894() {

  var piece1 = await loadModelAsync({path:'./models/trees_mwoie_1.glb'});
  piece1.scale.setScalar(0.1);
  piece1.position.x = randomInRange(-4,4);
  piece1.position.z = randomInRange(-4,4);
  piece1.updateMatrix();
  // #Code: nnnanananame38744 #
  // we need some name auto system here
  // temp name for now
  piece1.name = 'trees_mwoie_1';
  store.state.game.scene.add(piece1);
  store.state.game.importedModels.add(piece1);
  store.state.game.selectableItems.add(piece1);

// debugger
  // need to update box after a transform like scale
  // piece1.boxHelperPointer?.box.setFromObject(piece1);
  // piece1.refreshBoxHelper();
  // piece1.moreBuild_CM({targetGroup:store.state.game.helpersGroup});




  var piece2 = await loadModelAsync({path:'./models/bench1.glb'});
  // piece2.scale.setScalar(0.1);
  store.state.game.scene.add(piece2);
  store.state.game.importedModels.add(piece2);
  piece2.scale.setScalar(0.2);
  piece2.updateMatrix();
  piece2.name = 'bench1';

  store.state.game.selectableItems.add(piece2);
  // piece2.refreshBoxHelper();
  // piece2.moreBuild_CM({targetGroup:store.state.game.helpersGroup});




  const piece3 = await loadModelAsync({path:'./models/poly-cat-w-hat.glb'});
  // piece2.scale.setScalar(0.1);
  store.state.game.scene.add(piece3);
  store.state.game.importedModels.add(piece3);
  piece3.scale.setScalar(0.02);
  piece3.updateMatrix();
  piece3.name = 'poly-cat';

  store.state.game.selectableItems.add(piece3);
  // piece3.moreBuild_CM({targetGroup:store.state.game.helpersGroup});


}
