import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const packageJson = require('../package.json');

export default {
  input: ['src/index.ts', 'src/Header/index.tsx'],
  output: [
    {
      dir: 'build',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
};
