import Physics from '@dimforge/rapier3d-compat';

export default async (store) => {

  await Physics.init();

  store.setState({
    physics: {
      // fyi val 9 is hard on games in goofyness styles
      core: new Physics.World({
        x: 0.0,
        // y: -9.81,
        y: -10,
        z: 0.0
      })
    }
  });
};
