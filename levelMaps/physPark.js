import LevelMap from './levelMap';

import { store } from 'alexandria/store';

import {
  DirectionalLight,
  AmbientLight,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3
} from 'three';

import { MeshBuilder } from 'alexandria/tools/meshBuilder';
import { randomInRange, randomFromArr } from 'alexandria/math/mathMore';

const internals = {};

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

    const floorSize = 200;
    const goalHeight = 100;
    const goalThickness = 5;
    const items = 400;
    const maxHeight = 30;

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
      physics: {
        rigidBody: 'fixed',
        collider: {
          type: 'cuboid',
          friction: 10
        }
      }
    }));

    // Red Goal
    this.add(MeshBuilder({
      mesh: 'rectangle',
      width: goalThickness,
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
        collider: {
          type: 'cuboid',
          // onCollisionEvent: internals.collisionHandler('bouncy'),
          // onContactForceEvent: internals.defaultContactForceEvent
        }
      }
    }));

    // Blue Goal
    this.add(MeshBuilder({
      mesh: 'rectangle',
      width: goalThickness,
      height: goalHeight,
      depth: floorSize,
      color: 0x0000ff,
      position: {
        x: floorSize / 2,
        y: goalHeight / 2,
        z: 0
      },
      physics: {
        rigidBody: 'fixed',
        collider: {
          type: 'cuboid',
          // sensor: true,
          // onCollisionEvent: internals.collisionHandler('sticky'),
          // onContactForceEvent: internals.defaultContactForceEvent
        }
      }
    }));

    // Blue Goal 2
    // this.add(MeshBuilder({
    //   mesh: 'rectangle',
    //   width: 1,
    //   height: goalHeight,
    //   depth: floorSize,
    //   color: 0x0000ff,
    //   position: {
    //     x: -floorSize / 2,
    //     y: goalHeight / 2,
    //     z: 0
    //   },
    //   physics: {
    //     rigidBody: 'fixed',
    //     collider: {
    //       type: 'cuboid',
    //       // sensor: true,
    //       onCollisionEvent: internals.collisionHandler('sticky'),
    //       onContactForceEvent: internals.defaultContactForceEvent
    //     }
    //   }
    // }));

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
        size: randomInRange(2, 4),
        color: randomFromArr(color),
        position: {
          x: randomInRange(-50, 50),
          y: randomInRange(maxHeight, 1),
          z: randomInRange(-40, 40)
        },
        physics: {
          rigidBody: 'dynamic',
          gravityScale: 0,
          collider: {
            type: 'cuboid'
          },
          linvel: [
            Math.round(randomInRange(-180, 180)),
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
        radius: randomInRange(2, 4),
        color: randomFromArr(color),
        position: {
          x: randomInRange(-50, 50),
          y: randomInRange(maxHeight, 1),
          z: randomInRange(-50, 50)
        },
        physics: {
          rigidBody: 'dynamic',
          gravityScale: 2,
          linvel: [
            Math.round(randomInRange(-180, 180)),
            Math.round(randomInRange(-4, 40)),
            Math.round(randomInRange(-4, 4))
          ],
          collider: {
            type: 'ball'
          }
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

const avgPoint = new Vector3();
const avgNormal = new Vector3();
const impulseForce = new Vector3();
internals.collisionHandler = (type, forceMultiplier = -40000000000) => (props) => {

  const { obj1, obj2, manifold, flipped, started } = props;

  const contactInfo = obj1.collider.contactCollider(obj2.collider);

  // console.log('contactInfo', contactInfo);

  if (contactInfo) {
    // Calculate average normal and average contact point
    avgNormal.copy({
      x: (contactInfo.normal1.x + contactInfo.normal2.x) / 2,
      y: (contactInfo.normal1.y + contactInfo.normal2.y) / 2,
      z: (contactInfo.normal1.z + contactInfo.normal2.z) / 2,
    });

    avgPoint.copy({
      x: (contactInfo.point1.x + contactInfo.point2.x) / 2,
      y: (contactInfo.point1.y + contactInfo.point2.y) / 2,
      z: (contactInfo.point1.z + contactInfo.point2.z) / 2,
    });

    // Calculate impulse force
    impulseForce.copy({
      x: forceMultiplier * avgNormal.x,
      y: forceMultiplier * avgNormal.y,
      z: forceMultiplier * avgNormal.z,
    });

    // DOCS on RigidBody
    // https://rapier.rs/javascript3d/classes/RigidBody.html

    // Funcs available on obj2.rigidBody
    // resetForces(true); // Reset the forces to zero.
    // resetTorques(true); // Reset the torques to zero.
    // addForce(force: vec3, wake: bool);
    // addTorque(torque: vec3, wake: bool);
    // addForceAtPoint(force: vec3, point: vec3, wake: bool);
    // applyImpulse(impulse: vec3, wake: bool);
    // applyTorqueImpulse(torqueImpulse: vec3, wake: bool);
    // applyImpulseAtPoint(impulse: vec3, point: vec3, wake: bool);
    // And many more like
    // setLinvel(vel: vec3, wake: bool)
    // setGravityScale(factor: number, wake: bool)

    switch (type) {
    case 'sticky': {
      // I only sorta know why this works but it's cool anyways
      obj2.rigidBody.addForce(avgPoint);
    }
      break;
    case 'bouncy': {
      obj2.rigidBody.addForce(impulseForce.multiplyScalar(-1));
      // obj2.rigidBody.impulseForce(impulseForce.multiplyScalar(-1));
      obj2.rigidBody.addTorque(impulseForce.multiplyScalar(-1));
      obj2.rigidBody.applyTorqueImpulse(impulseForce.multiplyScalar(-1));
    }
      break;
    }

  }
};

internals.defaultContactForceEvent = ({ obj1, obj2, manifold, flipped, started }) => {

  if (started) {
    console.log('onContactForceEvent, started, manifold, flipped', started, manifold, flipped);
  }
  else {
    console.log('onContactForceEvent, obj1, obj2, started', obj1, obj2, started);
  }
};
