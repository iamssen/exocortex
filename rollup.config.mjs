import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: {
      lib: 'lib.ts',
      api: 'api.ts',
    },
    output: {
      dir: 'dist',
      format: 'es',
      sourcemap: true,
    },
    plugins: [typescript()],
  },
  {
    input: {
      lib: 'lib.ts',
      api: 'api.ts',
    },
    output: {
      dir: 'dist',
      format: 'es',
      entryFileNames: '[name].d.ts',
    },
    plugins: [dts()],
  },
];

export default config;
