import Physics from '@dimforge/rapier3d-compat';

export default async (store) => {

  store.setState({ physics: Physics });

  await Physics.init();
};
