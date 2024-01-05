import * as BitECS from 'bitecs';

export default (store) => {

  store.setState({
    ecs: {
      world: BitECS.createWorld()
    }
  });
};
