import { Mesh } from 'three';

import { CoatOfArms } from './coatOfArms';

import {
  CubeMesh,
  PlaneMesh,
  SphereMesh,
  RectangularPrismMesh
} from 'alexandria/primitives';

/*
Example usage
this.add(MeshBuilder({
  mesh: 'plane',
  color: 0x4fff0f,
  scale: 12,
  shadow: 'receive',
  texture: {
    path: './textures/myrthe-van-tol-grass-texture.jpeg',
    wrapping: RepeatWrapping,
    repeat: 8,
    colorSpace: SRGBColorSpace
  },
  physics: { rigidBody: 'fixed' }
}));
*/

const internals = {};

export function MeshBuilder(props) {

  const {
    mesh: _mesh,
    geometry,
    material,
    // Props for primitives defined at root lvl for convenience
    color,
    size,
    width,
    height,
    depth,
    radius,
    debug,
    ...coatOfArmsProps
  } = props;

  let { meshProps = {} } = props;

  internals.mergeWithObjectIfExists(
    meshProps,
    {
      color,
      size,
      width,
      height,
      depth,
      radius,
      debug
    }
  );

  let mesh = _mesh;

  if (!mesh && (!geometry || !material)) {
    throw new Error('Must provide \'geometry\' and \'material\' to MeshBuilder if \'mesh\' is not passed');
  }

  if (!mesh) {
    // Build new mesh
    mesh = new Mesh(geometry, material);
  }
  else {
    switch (mesh) {
    case 'cube':
      mesh = new CubeMesh(meshProps);
      break;
    case 'rectangularPrism':
      mesh = new RectangularPrismMesh(meshProps);
      break;
    case 'plane':
      mesh = new PlaneMesh(meshProps);
      if (!coatOfArmsProps.rotation) {
        coatOfArmsProps.rotation = [-Math.PI / 2, 0, 0];
      }
      break;
    case 'sphere':
      mesh = new SphereMesh(meshProps);
      break;
    default:
      throw new Error(`Invalid mesh string '${mesh}'`);
    }
  }

  return CoatOfArms({
    mesh,
    ...coatOfArmsProps
  });
}

internals.mergeWithObjectIfExists = (obj, items) => {

  Object.entries(items).forEach(([key, val]) => {

    if (val) {
      obj[key] = val;
    }
  });
}