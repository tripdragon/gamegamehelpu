import Hello from './hello';

export default function() {

  const initializers = [
    Hello
  ];

  // Pass context or w/e to initializers
  initializers.forEach((init) => init());
}
