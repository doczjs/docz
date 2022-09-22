import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import { rehypeDocz } from '@docz/rehype';
import { defineConfig } from 'astro/config';
import _ from 'lodash';
import remarkToc from 'remark-toc';

import type { Config, ConfigObj } from './types';
import { doczVitePlugin } from './vite';

function mergeCustomizer(obj: any, src: any) {
  if (_.isArray(obj)) {
    return obj.concat(src);
  }
  return _.merge(obj, src);
}

export function createAstroConfig(config: ConfigObj, doczConfig?: Config) {
  const baseConfig = config.rawConfig;
  const remarkPlugins = doczConfig?.remarkPlugins || [];
  const rehypePlugins = doczConfig?.rehypePlugins || [];
  const viteDefaultConfig = {
    plugins: [doczVitePlugin(config.rawConfig)],
    ssr: {
      external: ['github-slugger'],
    },
  };

  const vite = _.mergeWith(
    viteDefaultConfig,
    doczConfig?.viteConfig,
    mergeCustomizer
  );

  return defineConfig({
    publicDir: baseConfig.publicDir,
    outDir: baseConfig.distDir,
    site: baseConfig.site,
    base: baseConfig.base,
    output: 'static',
    integrations: [
      mdx({
        rehypePlugins: rehypePlugins.concat([rehypeDocz]),
        remarkPlugins: remarkPlugins.concat([remarkToc]),
      }),
      react(),
      vue(),
      ...(doczConfig?.astroIntegrations || []),
    ],
    server: {
      host: baseConfig.host,
      port: baseConfig.port,
    },
    vite,
    markdown: {
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'dracula',
      },
    },
  });
}
