/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs-extra';
import { resolve } from 'path';
import { defineConfig } from 'tsup';

import baseConfig from '../config/tsup';

export default defineConfig((options) => ({
  ...baseConfig(options),
  clean: true,
  platform: 'node',
  entry: ['src/index.ts'],
  async onSuccess() {
    await fs.copy(
      resolve(__dirname, 'templates'),
      resolve(__dirname, 'dist/templates')
    );
  },
}));
