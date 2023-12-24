import { babel } from '@rollup/plugin-babel';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';

export default {
  input: 'main.js', // Entry file
  output: {
    file: 'party/bundle.js', // Output file
    format: 'esm' // ES Module format
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    html({ title: 'GameGame' }),
    serve({
      open: true,
      contentBase: ['party']
    })
  ]
};
