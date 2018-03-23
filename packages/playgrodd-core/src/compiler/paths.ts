import * as fs from 'fs'
import * as path from 'path'

export const ROOT = fs.realpathSync(process.cwd())
export const PLAYGRODD = path.join(ROOT, '.playgrodd')
export const THEME = path.join(PLAYGRODD, 'theme')
export const INDEX_JS = path.join(THEME, 'index.jsx')
export const INDEX_HTML = path.join(THEME, 'index.html')

export const DIST = path.join(PLAYGRODD, 'dist')
