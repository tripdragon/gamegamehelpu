import Physics from '@dimforge/rapier3d-compat';

export default (store) => {

  store.setState({ physics: Physics });
};
