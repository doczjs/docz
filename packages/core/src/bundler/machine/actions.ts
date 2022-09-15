/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'fs-extra';
import * as path from 'path';
import sh from 'shelljs';
import log from 'signale';
import { assign } from 'xstate';
import type { Event } from 'xstate';

import * as paths from '../../config/paths';
import { copyDoczRc } from '../services/create-resources';

import type { ServerMachineCtx } from './context';

export const ensureFiles = ({ args }: ServerMachineCtx) => {
  const appPath = path.join(paths.root, args.themesDir);
  const userPagesPath = path.join(appPath, 'pages');
  const doczPagesPath = path.join(paths.docz, 'src', 'pages');
  // Copy 404 and other possible Gatsby pages
  if (fs.existsSync(userPagesPath)) {
    fs.copySync(userPagesPath, doczPagesPath);
  }

  copyDoczRc(args.config);

  const publicPath = path.join(paths.docz, '..', args.public);
  if (fs.existsSync(publicPath)) {
    const destinationPath = path.join(paths.docz, 'static', args.public);
    try {
      fs.copySync(publicPath, destinationPath);
    } catch (err: any) {
      log.error(
        `Failed to copy static assets from ${publicPath} to ${destinationPath} : ${err.message}`
      );
    }
  }
};

export const logError = (_ctx: ServerMachineCtx, ev: Event<any>) => {
  log.fatal(ev.data);
  sh.exit(0);
};

export const assignDataServer = assign({
  entries: (_ctx: ServerMachineCtx, ev: any) => ev.data.entries,
  dataServer: (_ctx: ServerMachineCtx, ev: any) => ev.data.server,
});
