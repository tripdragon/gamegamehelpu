import {
  TextureLoader,
  MeshStandardMaterial,
  AxesHelper,
  RepeatWrapping,
  SRGBColorSpace
} from 'three';

const internals = {};

export function MeshBuilder(props) {

  const {
    geometry,
    material,
    position,
    quaternion,
    scale,
    rotation,
    texture,
    shadow,
    physics
  } = props;

  let { mesh } = props;

  const { setOrScalar } = internals;

  if (!mesh) {
    if (!geometry || !material) {
      throw new Error('Must provide geometry and material if not providing mesh to Builder');
    }

    mesh = new MeshStandardMaterial(geometry, material);
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

  if (quaternion) {
    if (Array.isArray(quaternion) || typeof quaternion === 'number') {
      setOrScalar({ thing: mesh, prop: 'quaternion', val: [].concat(quaternion) });
    }
    else if (typeof quaternion === 'object') {
      Object.keys(quaternion).forEach((key) => {
        mesh.quaternion[key] = quaternion[key];
      });
    }
    else if (typeof quaternion === 'function') {
      quaternion(mesh.quaternion);
    }
    else {
      throw new Error(`Invalid val for quaternion '${quaternion}'`);
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
