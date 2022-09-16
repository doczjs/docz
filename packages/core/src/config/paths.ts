/* eslint-disable @typescript-eslint/naming-convention */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const root = process.cwd();
export const resolveApp = (to: string) => path.resolve(root, './', to);
export const templates = path.resolve(__dirname, './templates');
export const docz = resolveApp('.docz');
export const cache = path.resolve(docz, '.cache/');
export const src = path.join(docz, 'src');
export const pages = path.join(docz, 'src/pages');
export const layouts = path.join(docz, 'src/layouts');
export const publicDir = path.join(docz, 'public');
export const appPackageJson = resolveApp('package.json');
export const appTsConfig = resolveApp('tsconfig.json');

export const db = path.join(docz, 'db.json');
export const astroConfig = path.join(docz, 'astro.config.mjs');
