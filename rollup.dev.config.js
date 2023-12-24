import { babel } from '@rollup/plugin-babel';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
// import { rollupImportMapPlugin } from "rollup-plugin-import-map";

import css from "rollup-plugin-import-css";

export default {
  input: 'main.js', // Entry file
  output: {
    file: 'party/bundle.js', // Output file
    format: 'esm', // ES Module format
    sourcemap: true
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    nodeResolve(),
    html({ title: 'GameGame sdfsdf' }),
    serve({
      open: false,
      contentBase: ['party']
    }),
    livereload({
      watch: 'party'
    }),
    css()
    // rollupImportMapPlugin('./import-map.json')
  ]
};
