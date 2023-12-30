import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import 'dotenv/config';

// import css from 'rollup-plugin-import-css';

import scss from 'rollup-plugin-scss';

import copy from 'rollup-plugin-copy';
// import {fakeindex, bbb222} from './fakeindex.js';

const devPlugins = [
  serve({
    open: process.env.ROLLUP_SERVE_OPEN_BROWSER === 'true',
    contentBase: ['party']
  }),
  livereload({
    watch: 'party'
  })
];

export default {
  input: 'main.js', // Entry file
  // input: 'index.html', // Entry file
  external: ['./basestyles.css'],

  output: {
    file: 'party/bundle.js', // Output file
    format: 'esm', // ES Module format
    sourcemap: true
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    nodeResolve(),
    scss({ fileName: 'bundle.css' }),
    // css(),
    copy({
      targets: [
        { src: 'index.html', dest: 'party' },
        { src: 'basestyles.css', dest: 'party' },
        // { src: './notlilgui/notlilguistyle.css', dest: 'party' }
        // { src: ['assets/fonts/arial.woff', 'assets/fonts/arial.woff2'], dest: 'dist/public/fonts' },
        // { src: 'assets/images/**/*', dest: 'dist/public/images' }
      ]
    }),
    ...(process.env.ROLLUP_ENV === 'development' ? devPlugins : []),
  ]
};
