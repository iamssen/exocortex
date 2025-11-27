import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: {
      'model': 'model/index.ts',
      'server': 'server/index.ts',
      'date-utils': 'date-utils/index.ts',
      'projector': 'projector/index.ts',
    },
    output: {
      dir: 'dist',
      format: 'es',
      sourcemap: true,
    },
    plugins: [typescript()],
    external: ['luxon'],
  },
  {
    input: {
      'model': 'model/index.ts',
      'server': 'server/index.ts',
      'date-utils': 'date-utils/index.ts',
      'projector': 'projector/index.ts',
    },
    output: {
      dir: 'dist',
      format: 'es',
      entryFileNames: '[name].d.ts',
    },
    plugins: [dts()],
    external: ['luxon'],
  },
];

export default config;
