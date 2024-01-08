import { MeshBasicMaterial } from 'three';

import { CoatOfArms } from 'alexandria/tools/coatOfArms';

import {
  CubeMesh,
  PlaneMesh,
  SphereMesh
} from 'alexandria/primitives';

/*
Example usage
this.add(MeshBuilder({
  mesh: 'plane',
  meshProps: { color: 0x4fff0f },
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

export function MeshBuilder(props) {

  const {
    mesh: _mesh,
    geometry,
    material,
    meshProps = {},
    ...coatOfArmsProps
  } = props;

  let mesh = _mesh;

  if (!mesh && (!geometry || !material)) {
    throw new Error('Must provide \'geometry\' and \'material\' to MeshBuilder if \'mesh\' is not passed');
  }

  if (!mesh) {
    // Build new mesh
    mesh = new MeshBasicMaterial(geometry, material);
  }
  else {
    switch (mesh) {
    case 'cube':
      mesh = new CubeMesh(meshProps);
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
