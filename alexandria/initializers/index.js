import Hello from './hello';
// import ECS from './ecs';

export default function(store) {

  const initializers = [
    // ECS,
    Hello
  ];

  // Pass context or w/e to initializers
  initializers.forEach((init) => init(store));
}
