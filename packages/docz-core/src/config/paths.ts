import * as fs from 'fs'
import * as path from 'path'
import * as resolve from 'resolve'

export type Paths = {
  root: string
  docz: string
  packageJson: string
  appJs: string
  indexJs: string
  indexHtml: string
  dist: string
  templates: string
}

export const root = fs.realpathSync(process.cwd())
export const docz = path.resolve(root, '.docz')
export const packageJson = path.resolve(root, 'package.json')

export const appJs = path.resolve(docz, 'app.jsx')
export const indexJs = path.resolve(docz, 'index.jsx')
export const indexHtml = path.resolve(docz, 'index.html')
export const dist = path.resolve(docz, 'dist/')

export const templates = path.join(resolve.sync('docz-core'), '../templates')
