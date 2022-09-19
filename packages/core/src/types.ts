/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AstroUserConfig } from 'astro/config';

import type { paths } from '~/config';
import type { Plugin } from '~/lib/Plugin';

export type Env = 'production' | 'development';
export type ThemeConfig = Record<string, any>;

export interface DocgenConfig {
  handlers?: any[];
  resolver?: (ast: any, recast: any) => any;
  propFilter?: (prop: any) => boolean;
  searchPath?: string;
  searchPatterns?: string[];
}

export interface Menu {
  name: string;
  route?: string;
  href?: string;
  menu?: Menu[];
}

export interface DoczArgs {
  /* io args */
  root: string;
  src: string;
  files: string | string[];
  ignore: any[];
  watchIgnore: string;
  distDir: string;
  publicDir: string;
  editBranch: string;
  configFile: string;
  /* bundler args */
  debug: boolean;
  propsParser: boolean;
  host: string;
  port: number;
  /* website args */
  base: string;
  site: string;
  title: string;
  description: string;
}

export interface Config extends DoczArgs {
  docgenConfig: DocgenConfig;
  remarkPlugins: any[];
  rehypePlugins: any[];
  menu: Menu[];
  paths: typeof paths;
  plugins: Plugin[];
  themeConfig: ThemeConfig;
  filterComponents: (files: string[]) => string[];
  astroIntegrations?: AstroUserConfig['integrations'];
  viteConfig?: AstroUserConfig['vite'];
}

export interface EntryObj {
  link: string | null;
  filepath: string;
  fullpath: string;
  id: string;
  hidden: boolean;
  menu: string | null;
  name: string;
  route: string;
  slug: string;
  frontmatter?: Record<string, any>;
}

export interface ConfigObj {
  title: string;
  description: string;
  menu: Menu[];
  version: string | null;
  repository: string | null;
  themeConfig: ThemeConfig;
}
