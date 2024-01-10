import LevelMap from './levelMap';

import { store } from 'alexandria/store';

import {
  DirectionalLight,
  AmbientLight,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  DoubleSide,
  AxesHelper,
  TextureLoader,
  RepeatWrapping,
  SRGBColorSpace,
  CameraHelper,
  HemisphereLight
} from 'three';

import { Entities, Enty, Move, Spin, KeyWalk, Meep } from '../entities/basicEntites';

import { MeshBuilder } from 'alexandria/tools/meshBuilder';
import { randomInRange, randomFromArr } from 'alexandria/math/mathMore';

export class Level extends LevelMap {

  constructor() {
    super();
    this.init();
  }

  async init() {

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

    // const hemiLight = new HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
    // this.add(hemiLight);

    const floorSize = 38;
    const goalHeight = 10;

    // Floor
    this.add(MeshBuilder({
      mesh: 'plane',
      color: 0x4fff0f,
      scale: floorSize,
      shadow: 'receive',
      texture: {
        path: './textures/myrthe-van-tol-grass-texture.jpeg',
        wrapping: RepeatWrapping,
        repeat: floorSize / 3,
        colorSpace: SRGBColorSpace
      },
      physics: { rigidBody: 'fixed' }
    }));

    // Goal 1
    this.add(MeshBuilder({
      mesh: 'rectangle',
      width: 1,
      height: goalHeight,
      depth: floorSize,
      color: 0xff0000,
      position: {
        x: -floorSize / 2,
        y: goalHeight / 2,
        z: 0
      },
      physics: {
        rigidBody: 'fixed',
        collider: 'cuboid'
      }
    }));

    // Goal 2
    this.add(MeshBuilder({
      mesh: 'rectangle',
      width: 1,
      height: goalHeight,
      depth: floorSize,
      color: 0x0000ff,
      position: {
        x: floorSize / 2,
        y: goalHeight / 2,
        z: 0
      },
      physics: {
        rigidBody: 'fixed'
      }
    }));

    const items = 100;
    const maxHeight = 30;

    const colorTheme = ['#FF5733', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c', '#d35400', '#c0392b', '#2980b9'];
    const warmColorTheme1 = ['#FF5733', '#FFC300', '#FF5733', '#C70039', '#900C3F'];
    const lightColorTheme1 = ['#FAD02E', '#FFEB3B', '#C5E1A5', '#81C784', '#4DB6AC'];
    // https://color.adobe.com/s://adobe.ly/3ofZBcp
    const rockOnColorTheme = ['#010221', '#0A7373', '#B7BF99', '#EDAA25', '#C43302'];
    const blueTealMonochromaticTheme = ['#348888', '#22BABB', '#9EF8EE', '#FA7F08', '#F24405'];

    const color = blueTealMonochromaticTheme;

    // Cubes
    for (let i = 0; i < items; ++i) {
      this.add(MeshBuilder({
        mesh: 'cube',
        size: 1,
        color: randomFromArr(color),
        position: {
          x: randomInRange(-4, 4),
          y: randomInRange(maxHeight, 1),
          z: randomInRange(-4, 4)
        },
        physics: {
          rigidBody: 'dynamic',
          linvel: [
            Math.round(randomInRange(-40, 40)),
            Math.round(randomInRange(-4, 40)),
            Math.round(randomInRange(-4, 4))
          ]
        }
      }));
    }

    // Spheres
    for (let i = 0; i < items; ++i) {
      this.add(MeshBuilder({
        mesh: 'sphere',
        radius: 0.5,
        color: randomFromArr(color),
        position: {
          x: randomInRange(-4, 4),
          y: randomInRange(maxHeight, 1),
          z: randomInRange(-4, 4)
        },
        physics: {
          rigidBody: 'dynamic',
          collider: { type: 'sphere' }
        }
      }));
    }

    // return

    //     const cube = new Cube({size: 0.2,debug: true, color:0xffffff});
    //     cube.position.y = 1;

    //     // cube.update = function(){
    //     //   // debugger
    //     //   this.position.x += 0.01;
    //     //   console.log(this.name);
    //     // }

    //     this.add( cube );
    //     cube.name = 'sldkfndsf';

    //     st.animationPool.add(cube);
    //     cube.entities = new Entities(cube);

    //     cube.entities.add(new Spin(cube));

    //     // cube.entities.add(new Move());
    //     // now just some arbitary builder
    //     // cube.entities.add( Meep( 'moop', function(){ this.position.z += 0.01 } ) );

    //     cube.entities.add(new KeyWalk(cube, 0.01, 0.01));

    //     for (var i = 0; i < 22; i++) {

    //       const cube = new Cube({size: 0.2,debug: true, color:Math.random()* 0xffffff});

    //       this.add( cube );
    //       cube.name = 'sldkfndsf' + i;

    //       st.animationPool.add(cube);
    //       cube.entities = new Entities(cube);

    //       cube.entities.add(new Spin(cube));

    //       cube.position.set(randomInRange(4, -4), 1, randomInRange(4, -4))
    //       cube.rotation.y = Math.random() * Math.PI * 2;

    //       // cube.entities.add(new Move());
    //       // now just some arbitary builder
    //       // cube.entities.add( Meep( 'moop', function(){ this.position.z += 0.01 } ) );

    //       cube.entities.add(new KeyWalk(cube, 0.01, 0.01));
    //     }
  }
}
