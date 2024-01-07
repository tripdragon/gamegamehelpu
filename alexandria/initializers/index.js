import ECS from './ecs';
import Keyboard from './keyboard';
import Physics from './physics';
import threeStart_CM from './threeStart_CM';

export default async function(store) {

  const initializers = [
    Physics,
    ECS,
    Keyboard,
    threeStart_CM // not a class
  ];

  // Pass store to initializers
  for (const init of initializers) {
    await init(store);
  }
}
