import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'
import resolve from 'resolve'

const ENV_PUBLIC_URL = process.env.PUBLIC_URL

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

const getPublicUrl = (appPackageJson: string) =>
  ENV_PUBLIC_URL || require(appPackageJson).homepage

const getServedPath = (appPackageJson: string) => {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl =
    ENV_PUBLIC_URL || (publicUrl ? url.parse(publicUrl).pathname : '/')
  return ensureSlash(servedUrl, true)
}

export const root = fs.realpathSync(process.cwd())
const resolveApp = (to: string) => path.resolve(root, to)

export interface Paths {
  root: string
  docz: string
  packageJson: string
  servedPath: string
  dist: string
  templates: string
  appJs: string
  indexJs: string
  dataJson: string
  indexHtml: string
}

export const templates = path.join(resolve.sync('docz'), '../templates')

export const docz = resolveApp('.docz')
export const packageJson = resolveApp('package.json')
export const servedPath = getServedPath(resolveApp('package.json'))

export const dist = path.resolve(docz, 'dist/')

export const appJs = path.resolve(docz, 'app.jsx')
export const indexJs = path.resolve(docz, 'index.jsx')
export const dataJson = path.resolve(docz, 'data.json')

export const indexHtml = path.resolve(docz, 'index.html')
