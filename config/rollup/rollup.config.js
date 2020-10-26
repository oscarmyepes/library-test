/*
  Rollup configuration to build the library from index file.
  The files generated with this configuration allows users to 
  import the whole library in this way:

  import { SearchBar, FitmentSelector } from "sunhammer-ui";  
*/
import rollupCommon from './rollup.common.config';
import typescript from 'rollup-plugin-typescript2';
import packageJson from '../../package.json';

export default {
  ...rollupCommon,
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: packageJson.unpkg,
      format: 'umd',
      name: 'Sunhammer',
    },
  ],
  plugins: [
    ...rollupCommon.plugins,
    typescript({ useTsconfigDeclarationDir: true }),
  ],
};
