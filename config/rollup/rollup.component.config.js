/*
  Rollup configuration to build the library for each component separately.
  The files generated with this configuration will be placed in build/{ComponentName}/
  and allow users to import each component this way:

  import SearchBar from "sunhammer-ui/build/SearchBar";
  import FitmentSelector from "sunhammer-ui/build/FitmentSelector";
*/

import typescript from 'rollup-plugin-typescript2';
import rollupCommon from './rollup.common.config';

/* From argv's we get the component name to generate the files in the proper folder
   The comman to run this file must contain the -i flag.
   Example:
   rollup -c ./config/rollup/rollup.component.config.js -i ./src/components/MyComponent/index.tsx
*/
const inputIndexFlag = process.argv.findIndex((item) => item === '-i');
const input = process.argv[inputIndexFlag + 1];
const inputPaths = input.split('/');
const componentName = inputPaths[inputPaths.length - 2];

export default {
  ...rollupCommon,
  output: [
    {
      file: `build/${componentName}/index.js`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `build/${componentName}/index.esm.js`,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: `build/${componentName}/index.umd.js`,
      format: 'umd',
      name: 'Sunhammer',
    },
  ],
  plugins: [
    ...rollupCommon.plugins,
    typescript({ tsconfig: 'tsconfig.component.json' }),
  ],
};
