import { build } from './build';
import { server } from './server';

import { Bundler } from '~/lib/Bundler';
import type { Config as Args } from '~/types';

export const bundler = (args: Args) => {
  return new Bundler({ args, build, server: server(args) });
};
