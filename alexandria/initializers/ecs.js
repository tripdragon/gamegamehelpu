import * as BitECS from "bitecs";

export default (store) => {

  store.setState({
    ecs: {
      lib: BitECS,
      world: BitECS.createWorld()
    }
  });
};
