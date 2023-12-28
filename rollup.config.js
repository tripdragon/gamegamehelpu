import { babel } from '@rollup/plugin-babel';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import 'dotenv/config';

import css from 'rollup-plugin-import-css';

import copy from 'rollup-plugin-copy';
import {fakeindex, bbb222} from './fakeindex.js';

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
  output: {
    file: 'party/bundle.js', // Output file
    format: 'esm', // ES Module format
    sourcemap: true
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    nodeResolve(),
    // html({ title: 'GameGame sdfsdf' }),
    // html({ title: 'GameGame sdfsdf', template:{} }),
    
    html({
      // template :  ({ attributes, bundle, files, publicPath, title })=>{return"narf333"}
      // template :  ({ attributes, bundle, files, publicPath, title })=>{return bbb222()}
      
      template :  ({ attributes, bundle, files, publicPath, title })=>{return fakeindex({ attributes, bundle, files, publicPath, title })}
      
    }),
    
    css(),
    copy({
      targets: [
        { src: 'index222.html', dest: 'party' }
        // { src: ['assets/fonts/arial.woff', 'assets/fonts/arial.woff2'], dest: 'dist/public/fonts' },
        // { src: 'assets/images/**/*', dest: 'dist/public/images' }
      ]
    }),
    ...(process.env.ROLLUP_ENV === 'development' ? devPlugins : []),
  ]
};
