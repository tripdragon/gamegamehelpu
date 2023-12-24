import Hello from './hello';

export default function(store) {

  const initializers = [
    Hello
  ];

  // Pass context or w/e to initializers
  initializers.forEach((init) => init(store));
}
