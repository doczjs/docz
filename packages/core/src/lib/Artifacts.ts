/* eslint-disable consistent-return */
import { findUp } from 'find-up';
import fs from 'fs-extra';
import path, { relative, resolve } from 'path';

import { paths } from '~/config';
import type { Config } from '~/types';
import { finds } from '~/utils/load-config';
import { outputTemplate } from '~/utils/template';

async function getConfigFilepath(config: Config) {
  if (config.configFile) {
    return relative(paths.docz, resolve(paths.root, config.configFile));
  }
  const configFilepath = await findUp(finds('docz'), { cwd: paths.root });
  if (configFilepath) {
    return relative(paths.docz, configFilepath);
  }
}

export class Artifacts {
  static async generate(config: Config) {
    const { paths } = config;
    await fs.ensureDir(paths.docz);
    await fs.ensureDir(paths.src);
    await fs.ensureDir(paths.pages);

    const envFile = path.join(paths.docz, 'src/env.d.ts');
    const astroConfig = path.join(paths.docz, 'astro.config.mjs');
    const layoutFile = path.join(paths.layouts, 'Layout.astro');
    const dynamicRoute = path.join(paths.pages, '[...slug].astro');

    await outputTemplate('env.d.ts.tpl', envFile);
    await outputTemplate('layout.tpl.astro', layoutFile);
    await outputTemplate('[...slug].tpl.astro', dynamicRoute);
    await outputTemplate('astro.config.mjs.tpl', astroConfig, {
      configFilepath: await getConfigFilepath(config),
    });
  }
}
