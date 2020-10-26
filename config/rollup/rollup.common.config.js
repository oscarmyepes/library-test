import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { config } from 'dotenv';
import images from 'rollup-plugin-image-files';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

export default {
  external: ['react', 'react-dom'],
  plugins: [
    peerDepsExternal(),
    postcss({
      extract: true,
      minimize: true,
      modules: true,
      use: ['sass'],
    }),
    images(),
    commonjs(),
    terser(),
    replace({
      process: JSON.stringify({
        env: {
          ...config().parsed,
        },
      }),
    }),
  ],
};
