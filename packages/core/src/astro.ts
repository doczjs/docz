import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import _ from 'lodash';
import remarkToc from 'remark-toc';

import pkg from '../package.json';

import type { Config, ConfigObj } from '~/types';
import { viteExportFilemeta } from '~/utils/vite';

export function createAstroConfig(config: ConfigObj, doczConfig?: Config) {
  const baseConfig = config.rawConfig;
  const remarkPlugins = doczConfig?.remarkPlugins || [];
  const rehypePlugins = doczConfig?.rehypePlugins || [];
  return defineConfig({
    publicDir: baseConfig.publicDir,
    outDir: baseConfig.distDir,
    site: baseConfig.site,
    base: baseConfig.base,
    output: 'static',
    integrations: [
      mdx({
        rehypePlugins,
        remarkPlugins: remarkPlugins.concat([remarkToc]),
      }),
      react(),
      ...(doczConfig?.astroIntegrations || []),
    ],
    server: {
      host: baseConfig.host,
      port: baseConfig.port,
    },
    vite: _.merge(
      {
        plugins: [viteExportFilemeta(config.rawConfig)],
        ssr: {
          external: [...Object.keys(pkg.dependencies), 'github-slugger'],
        },
      },
      doczConfig?.viteConfig
    ),
  });
}
