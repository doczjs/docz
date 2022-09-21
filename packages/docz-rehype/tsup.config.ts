/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'tsup';

import baseConfig from '../config/tsup';

import pkg from './package.json';

export default defineConfig((options) => ({
  ...baseConfig(options),
  platform: 'node',
  external: ['typescript', 'fs', ...Object.keys(pkg.dependencies)],
  entry: {
    index: 'src/index.ts',
  },
}));
