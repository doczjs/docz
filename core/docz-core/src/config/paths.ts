import * as fs from 'fs'
import * as path from 'path'
import * as resolve from 'resolve'

export const ensureSlash = (filepath: any, needsSlash: boolean) => {
  const hasSlash = filepath.endsWith('/')

  if (hasSlash && !needsSlash) {
    return filepath.substr(filepath, filepath.length - 1)
  } else if (!hasSlash && needsSlash) {
    return `${filepath}/`
  } else {
    return filepath
  }
}

export const root = fs.realpathSync(process.cwd())
export const resolveApp = (to: string) => path.resolve(root, to)
export const resolveOwn = (to: string) => path.resolve(__dirname, '../', to)

export const checkIsDoczProject = (config: any) => {
  return path.parse(config.root || root).base === '.docz'
}

export const getRootDir = (config: any) => {
  const isDoczProject = checkIsDoczProject(config)
  return isDoczProject ? path.resolve(root, '../') : root
}

export const getThemesDir = (config: { themesDir: string }) => {
  return path.join(getRootDir(config), config.themesDir)
}

export interface Paths {
  root: string
  templates: string
  packageJson: string
  servedPath: (base: string) => string

  docz: string
  app: string
  cache: string
  appPublic: string
  appNodeModules: string
  appPackageJson: string
  appYarnLock: string
  gatsbyConfig: string
  gatsbyBrowser: string
  gatsbyNode: string
  gatsbySSR: string
  ownNodeModules: string

  checkIsDoczProject: (config: any) => boolean
  getRootDir: (config: any) => string
  getThemesDir: (config: any) => string
  getDist: (dest: string) => string
  distPublic: (dest: string) => string

  importsJs: string
  rootJs: string
  indexJs: string
  indexHtml: string
  db: string
}

export const templates = path.join(resolve.sync('docz-core'), '../templates')

export const packageJson = resolveApp('package.json')
export const servedPath = (base: string) => ensureSlash(base, true)

const IS_DOCZ_PROJECT = path.parse(root).base === '.docz'

export const docz = resolveApp(IS_DOCZ_PROJECT ? './' : '.docz')
export const cache = path.resolve(docz, '.cache/')
export const app = path.resolve(docz, 'app/')
export const appPublic = path.resolve(docz, 'public/')
export const appNodeModules = resolveApp('node_modules')
export const appPackageJson = resolveApp('package.json')
export const appYarnLock = resolveOwn('yarn.lock')
export const ownNodeModules = resolveOwn('node_modules')
export const gatsbyConfig = resolveApp('gatsby-config.js')
export const gatsbyBrowser = resolveApp('gatsby-browser.js')
export const gatsbyNode = resolveApp('gatsby-node.js')
export const gatsbySSR = resolveApp('gatsby-ssr.js')

export const getDist = (dest: string) => path.join(root, dest)
export const distPublic = (dest: string) => path.join(dest, 'public/')

export const importsJs = path.resolve(app, 'imports.js')
export const rootJs = path.resolve(app, 'root.jsx')
export const indexJs = path.resolve(app, 'index.jsx')
export const indexHtml = path.resolve(app, 'index.html')
export const db = path.resolve(app, 'db.json')
