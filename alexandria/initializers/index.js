import Hello from './hello';
import ECS from './ecs';
import Physics from './physics';
import threeStart from './threeStart';

export default async function(store) {

  const initializers = [
    ECS,
    Physics,
    Hello,
    threeStart
  ];

  // Pass store to initializers
  for (const init of initializers) {
    await init(store);
  }
}
