import Hello from './hello';
import ECS from './ecs';
import Physics from './physics';

export default function(store) {

  const initializers = [
    ECS,
    Physics,
    Hello
  ];

  // Pass context or w/e to initializers
  initializers.forEach((init) => init(store));
}
