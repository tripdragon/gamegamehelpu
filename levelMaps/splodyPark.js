import LevelMap from './levelMap';

import {
  DirectionalLight,
  AmbientLight,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3
} from 'three';

import * as Themes from 'alexandria/modules/colorThemes';

import { MeshBuilder } from 'alexandria/meshBuilder';
import { randomInRange, randomFromArr } from 'alexandria/math/mathMore';

const internals = {};

export class Level extends LevelMap {

  constructor() {
    super();
    this.init();
  }

  async init() {

    this.loadFromData({
      name: "stufff group",
      camera : {
        // position : [1,1,8],
        position : [7.673987472203893, 4.997369507572419, 8.833970822360577],
        rotation: [0,0,0],
        lookAt: [0,0,0],
        type:"perspective",
        controlType : "orbit",
      },
    });
    
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
    // this.add(shadowHelper);

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
      mesh: 'rectangularPrism',
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
        // onCollision: internals.collisionHandler('bouncy'),
        // onContactForce: internals.defaultContactForceEvent,
        collider: {
          type: 'cuboid'
        }
      }
    }));

    // Blue Goal
    this.add(MeshBuilder({
      mesh: 'rectangularPrism',
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
        // onCollision: (stuff) => {

        //   console.log('BLUE GOAL onCollision stuff', stuff);
        // },
        // onContactForce: (stuff) => {

        //   console.log('onContactForce stuff', stuff);
        // },
        // onCollision: internals.collisionHandler('sticky'),
        // onContactForce: internals.defaultContactForceEvent
        collider: {
          type: 'cuboid'
          // sensor: true
        }
      }
    }));

    const colorTheme = Themes.blueTealMonochromaticTheme;

    // Cubes
    for (let i = 0; i < items; ++i) {
      this.add(MeshBuilder({
        mesh: 'cube',
        size: randomInRange(2, 4),
        color: randomFromArr(colorTheme),
        position: {
          x: randomInRange(-50, 50),
          y: randomInRange(maxHeight, 1),
          z: randomInRange(-40, 40)
        },
        physics: {
          rigidBody: 'dynamic',
          gravityScale: 0,
          // onCollision: (stuff) => {

          //   console.log('CUBE onCollision stuff', stuff);
          // },
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
        color: randomFromArr(colorTheme),
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
          // onCollision: (stuff) => {

          //   console.log('Sphere onCollision stuff', stuff);
          // },
          collider: {
            type: 'ball'
          }
        }
      }));
    }
  }
}

const avgPoint = new Vector3();
const avgNormal = new Vector3();
const impulseForce = new Vector3();
internals.collisionHandler = (type, forceMultiplier = -40000000000) => (props) => {

  const {
    obj1,
    obj2,
    collisionInfo,
    manifold,
    flipped,
    started
  } = props;

  // console.log('collisionInfo', collisionInfo);

  if (collisionInfo) {
    // Calculate average normal and average contact point
    avgNormal.copy({
      x: (collisionInfo.normal1.x + collisionInfo.normal2.x) / 2,
      y: (collisionInfo.normal1.y + collisionInfo.normal2.y) / 2,
      z: (collisionInfo.normal1.z + collisionInfo.normal2.z) / 2,
    });

    avgPoint.copy({
      x: (collisionInfo.point1.x + collisionInfo.point2.x) / 2,
      y: (collisionInfo.point1.y + collisionInfo.point2.y) / 2,
      z: (collisionInfo.point1.z + collisionInfo.point2.z) / 2,
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

internals.defaultContactForceEvent = (props) => {

  const {
    collisionInfo,
    obj1,
    obj2,
    manifold,
    flipped,
    started
  } = props;

  if (started) {
    console.log('onContactForce, collisionInfo, started, manifold, flipped', collisionInfo, started, manifold, flipped);
  }
  else {
    console.log('onContactForce, collisionInfo, obj1, obj2, started', collisionInfo, obj1, obj2, started);
  }
};
