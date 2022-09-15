/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'path';
import logger from 'signale';

import * as paths from '../config/paths';

import type { Config as Args } from '~/types';

export interface BundlerServer {
  start(): void;
}

export type BuildFn = (config: Args, dist: string) => Promise<void>;
export type ServerFn = () => Promise<BundlerServer>;

export interface BundlerConstructor {
  args: Args;
  server: ServerFn;
  build: BuildFn;
}

export interface ConfigObj {
  [key: string]: any;
}

export class Bundler {
  private readonly args: Args;
  private server: ServerFn;
  private builder: BuildFn;

  constructor(params: BundlerConstructor) {
    const { args, server, build } = params;

    this.args = args;
    this.server = server;
    this.builder = build;
  }

  public async createApp(): Promise<BundlerServer> {
    return this.server();
  }

  public async build(): Promise<void> {
    const dist = paths.getDist(this.args.dest);
    const root = paths.getRootDir(this.args);

    if (root === path.resolve(dist)) {
      logger.fatal(
        new Error(
          'Unexpected option: "dest" cannot be set to the current working directory.'
        )
      );
      process.exit(1);
    }

    await this.builder(this.args, dist);
  }
}
