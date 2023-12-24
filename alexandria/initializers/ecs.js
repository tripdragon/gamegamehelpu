import {
  createWorld,
  // Types,
  // defineComponent,
  // defineQuery,
  // addEntity,
  // addComponent,
  // pipe
} from 'bitecs';

export default (store) => {

  store.setState({
    ecs: {
      world: createWorld()
    }
  });
};
