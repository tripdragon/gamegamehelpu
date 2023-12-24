import ECS from './ecs';
import Keyboard from './keyboard';
import Physics from './physics';
import threeStart from './threeStart';

export default async function(store) {

  const initializers = [
    ECS,
    Physics,
    Keyboard,
    threeStart
  ];

  // Pass store to initializers
  for (const init of initializers) {
    await init(store);
  }
}
