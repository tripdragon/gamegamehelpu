import { babel } from '@rollup/plugin-babel';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { rollupImportMapPlugin } from 'rollup-plugin-import-map';

export default {
  input: 'main.js', // Entry file
  output: {
    file: 'party/bundle.js', // Output file
    format: 'esm' // ES Module format
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    html({ title: 'GameGame sdfsdf' }),
    serve({
      open: true,
      contentBase: ['party']
    }),
    livereload({
      watch: 'party'
    }),
    rollupImportMapPlugin('./import-map.json')
  ]
};
