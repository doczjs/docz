/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'tsup';

import baseConfig from '../config/tsup';

export default defineConfig({
  ...baseConfig({}, { withReact: true }),
  external: ['esbuild', 'react/jsx-runtime', 'react', 'react-dom'],
  entry: {
    index: 'src/index.ts',
  },
});
