import * as fs from 'fs'
import * as path from 'path'

export const ROOT = fs.realpathSync(process.cwd())
export const PLAYGRODD = path.join(ROOT, '.playgrodd')
export const APP_JS = path.join(PLAYGRODD, 'app.jsx')
export const INDEX_JS = path.join(PLAYGRODD, 'index.jsx')
export const INDEX_HTML = path.join(PLAYGRODD, 'index.html')
export const DIST = path.join(PLAYGRODD, 'dist')
