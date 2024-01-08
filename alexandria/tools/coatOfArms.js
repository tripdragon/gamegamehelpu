import {
  TextureLoader,
  MeshStandardMaterial
} from 'three';

// Example usage
// this.add(CoatOfArms({
//   mesh: new Plane({
//     length: 1,
//     width: 1,
//     color: 0x4fff0f
//   }),
//   scale: 12,
//   rotation: [-Math.PI / 2, 0, 0],
//   shadow: 'receive',
//   texture: {
//     path: './textures/myrthe-van-tol-grass-texture.jpeg',
//     wrapping: RepeatWrapping,
//     repeat: 8,
//     colorSpace: SRGBColorSpace
//   },
//   physics: { rigidBody: 'fixed' }
// }));

const internals = {};

export function CoatOfArms(props) {

  const {
    mesh,
    position,
    scale,
    rotation,
    texture,
    shadow,
    physics
  } = props;

  const { setOrScalar } = internals;

  if (!mesh) {
    throw new Error('Must provide mesh to CoatOfArms');
  }

  if (position) {
    if (Array.isArray(position) || typeof position === 'number') {
      setOrScalar({ thing: mesh, prop: 'position', val: [].concat(position) });
    }
    else if (typeof position === 'object') {
      Object.keys(position).forEach((key) => {
        mesh.position[key] = position[key];
      });
    }
    else if (typeof position === 'function') {
      position(mesh.position);
    }
    else {
      throw new Error(`Invalid val for position '${position}'`);
    }
  }

  if (scale) {
    if (Array.isArray(scale) || typeof scale === 'number') {
      setOrScalar({ thing: mesh, prop: 'scale', val: [].concat(scale) });
    }
    else if (typeof scale === 'object') {
      Object.keys(scale).forEach((key) => {
        mesh.scale[key] = scale[key];
      });
    }
    else if (typeof scale === 'function') {
      scale(mesh.scale);
    }
    else {
      throw new Error(`Invalid val for scale '${scale}'`);
    }
  }

  if (rotation) {
    if (Array.isArray(rotation) || typeof rotation === 'number') {
      setOrScalar({ thing: mesh, prop: 'rotation', val: [].concat(rotation) });
    }
    else if (typeof rotation === 'object') {
      Object.keys(rotation).forEach((key) => {
        mesh.rotation[key] = rotation[key];
      });
    }
    else if (typeof rotation === 'function') {
      rotation(mesh.rotation);
    }
    else {
      throw new Error(`Invalid val for rotation '${rotation}'`);
    }
  }

  // Update matrix after modifications
  mesh.updateMatrix();

  if (texture) {
    if (!texture.path) {
      throw new Error('\'path\' is required if texture is specified');
    }

    new TextureLoader().loadAsync(texture.path)
      .then((_tex) => {

        if (texture.repeat) {
          setOrScalar({ thing: _tex, prop: 'repeat', val: [].concat(texture.repeat) });
        }

        if (texture.wrapping) {
          _tex.wrapS = _tex.wrapT = texture.wrapping;
        }

        if (texture.colorSpace) {
          _tex.colorSpace = texture.colorSpace;
        }

        _tex.needsUpdate = true;
        mesh.material.map = _tex;
        mesh.material.needsUpdate = true;
      });
  }

  if (shadow === 'receive') {
    mesh.receiveShadow = true;
  }
  else if (shadow === 'cast') {
    mesh.castShadow = true;
  }

  if (physics) {
    mesh.initPhysics(physics);
  }

  return mesh;
}

internals.setOrScalar = ({ thing, prop, val }) => {

  if (val.length === 1) {
    thing[prop].setScalar(val);
  }
  else {
    thing[prop].set(...val);
  }
};
