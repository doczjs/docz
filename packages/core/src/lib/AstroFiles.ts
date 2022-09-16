import fs from 'fs-extra';
import path from 'path';

import type { Config } from '~/types';
import { outputFileFromTemplate } from '~/utils/template';

export class AstroFiles {
  static async baseFiles(config: Config) {
    const { paths } = config;
    await fs.remove(paths.docz);

    await fs.ensureDir(paths.docz);
    await fs.ensureDir(paths.src);
    await fs.ensureDir(paths.pages);

    const envFile = path.join(paths.docz, 'src/env.d.ts');
    const astroConfig = path.join(paths.docz, 'astro.config.mjs');
    const layoutFile = path.join(paths.layouts, 'Layout.astro');
    const dynamicRoute = path.join(paths.pages, '[...slug].astro');

    await outputFileFromTemplate('env.d.ts.tpl', envFile);
    await outputFileFromTemplate('astro.config.mjs.tpl', astroConfig);
    await outputFileFromTemplate('layout.tpl.astro', layoutFile);
    await outputFileFromTemplate('[...slug].tpl.astro', dynamicRoute);
  }
}
