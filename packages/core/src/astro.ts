import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

import type { Config, DoczArgs } from './types';

export function createAstroConfig(baseConfig: DoczArgs, doczConfig?: Config) {
  return defineConfig({
    publicDir: baseConfig.publicDir,
    outDir: baseConfig.distDir,
    site: baseConfig.site,
    base: baseConfig.base,
    output: 'static',
    integrations: [mdx(), react(), ...(doczConfig?.astroIntegrations || [])],
    server: {
      host: baseConfig.host,
      port: baseConfig.port,
    },
    markdown: {
      extendDefaultPlugins: true,
      remarkPlugins: doczConfig?.remarkPlugins || [],
      rehypePlugins: doczConfig?.rehypePlugins || [],
    },
    vite: {
      ...(doczConfig?.viteConfig && doczConfig?.viteConfig),
    },
  });
}
