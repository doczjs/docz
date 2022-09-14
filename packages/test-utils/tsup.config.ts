/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'tsup';

import baseConfig from '../config/tsup';

export default defineConfig((options) => ({
  ...baseConfig(options),
  external: ['react'],
  entry: ['src/index.ts', 'config.ts', 'setup.ts'],
}));
