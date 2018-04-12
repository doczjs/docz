import * as fs from 'fs'
import * as path from 'path'

export type Paths = {
  root: string
  playgrodd: string
  packageJson: string
  appJs: string
  indexJs: string
  indexHtml: string
  dist: string
  templatesPath: string
}

export const root = fs.realpathSync(process.cwd())
export const playgrodd = path.resolve(root, '.playgrodd')
export const packageJson = path.resolve(root, 'package.json')

export const appJs = path.resolve(playgrodd, 'app.jsx')
export const indexJs = path.resolve(playgrodd, 'index.jsx')
export const indexHtml = path.resolve(playgrodd, 'index.html')
export const dist = path.resolve(playgrodd, 'dist/')

export const templatesPath = path.resolve(__dirname, '../../templates')
