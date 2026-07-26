import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: {
      model: 'model/index.ts',
      server: 'server/index.ts',
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
      model: 'model/index.ts',
      server: 'server/index.ts',
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
