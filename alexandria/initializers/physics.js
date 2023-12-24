import Physics from '@dimforge/rapier3d-compat';

export default async (store) => {

  await Physics.init();

  store.setState({ physics: {
    lib: Physics,
    world: new Physics.World({ x: 0.0, y: -9.81, z: 0.0 })
  }});
};
