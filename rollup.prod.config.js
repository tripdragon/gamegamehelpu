import { babel } from '@rollup/plugin-babel';
import html from '@rollup/plugin-html';

export default {
  input: 'main.js', // Entry file
  output: {
    file: 'party/bundle.js', // Output file
    format: 'esm' // ES Module format
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    html({ title: 'GameGame' })
  ]
};
