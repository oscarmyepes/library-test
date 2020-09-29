import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';


export default {
  input: ["src/index.ts", "src/Header/index.tsx"],
  output: [
    {
      dir: "build",
      format: "cjs",
      sourcemap: true
    }
  ],
  preserveModules: true, // Important if we want to code split
  plugins: [
    peerDepsExternal(),
    // resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
};
