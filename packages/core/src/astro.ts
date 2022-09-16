import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export function createAstroConfig() {
  return defineConfig({
    integrations: [mdx(), react()],
  });
}
