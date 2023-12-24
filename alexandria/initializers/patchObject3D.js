// we need a core patch of object3D to have interfaces
// so this is the simpliest route

import { Object3D, Vector3 } from 'three';

export function patchObject3D_CM() {

  Object3D.prototype.fish = 'neat!!';
  Object3D.prototype.entities = {};

  Object3D.prototype.simplePhysics = {
    velocity: new Vector3(),
    accelration : new Vector3(),
    force: new Vector3()
  }
}
