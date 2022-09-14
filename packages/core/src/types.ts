/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from 'next';

export type Env = 'production' | 'development';
export type ThemeConfig = Record<string, any>;

export interface Paths {
  root: string;
  templates: string;
  servedPath: (base: string) => string;

  docz: string;
  app: string;
  cache: string;

  checkIsDoczProject: (config: any) => boolean;
  getRootDir: (config: any) => string;
  getThemesDir: (config: any) => string;
  getDist: (dest: string) => string;
  distPublic: (dest: string) => string;

  importsJs: string;
  rootJs: string;
  indexJs: string;
  indexHtml: string;
  db: string;
}

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

export interface Argv {
  /* io args */
  root: string;
  base: string;
  src: string;
  files: string | string[];
  ignore: any[];
  public: string;
  dest: string;
  editBranch: string;
  config: string;
  /* bundler args */
  debug: boolean;
  propsParser: boolean;
  host: string;
  port: number;
  native: boolean;
  /* template args */
  title: string;
  description: string;
  /** slugify separator */
  separator: string;
}

export interface Config extends Argv {
  docgenConfig: DocgenConfig;
  remarkPlugins: any[];
  rehypePlugins: any[];
  menu: Menu[];
  paths: Paths;
  // TODO: add Plugin configuration here
  plugins: any[];
  themeConfig: ThemeConfig;
  themesDir: string;
  mdxExtensions: string[];
  filterComponents: (files: string[]) => string[];
  nextConfig?: NextConfig;
}
