import * as fs from 'fs'
import * as path from 'path'
import resolve from 'resolve'

const ensureSlash = (filepath: any, needsSlash: boolean) => {
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
  ownNodeModules: string

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

export const docz = resolveApp('.docz')
export const app = path.resolve(docz, 'app/')
export const cache = path.resolve(docz, 'cache/')
export const appPublic = path.resolve(docz, 'public/')
export const appNodeModules = resolveApp('node_modules')
export const appPackageJson = resolveApp('package.json')
export const ownNodeModules = resolveOwn('node_modules')

export const getDist = (dest: string) => path.join(root, dest)
export const distPublic = (dest: string) => path.join(dest, 'public/')

export const importsJs = path.resolve(app, 'imports.js')
export const rootJs = path.resolve(app, 'root.jsx')
export const indexJs = path.resolve(app, 'index.jsx')
export const indexHtml = path.resolve(app, 'index.html')
export const db = path.resolve(app, 'db.json')
