import fs from 'fs'
import path from 'path'
import mkdir from 'mkdirp'
import Bundler from 'parcel-bundler'
import trash from 'trash'

const ROOT_PATH = fs.realpathSync(process.cwd())
const PLAYGRODD_PATH = path.join(ROOT_PATH, '.playgrodd')
const THEME_PATH = path.join(PLAYGRODD_PATH, 'theme')
const INDEX_HTML = path.join(THEME_PATH, 'index.html')
const INDEX_JS = path.join(THEME_PATH, 'index.jsx')

export const CACHE_PATH = path.join(PLAYGRODD_PATH, 'cache')
export const DIST_PATH = path.join(PLAYGRODD_PATH, 'dist')

const checkMkdirTheme = () => {
  try {
    fs.lstatSync(THEME_PATH)
  } catch (err) {
    mkdir.sync(THEME_PATH)
  }
}

const tempFile = (filepath: string, content: string) =>
  new Promise((resolve, reject) => {
    checkMkdirTheme()

    try {
      fs.writeFileSync(filepath, content, 'utf-8')
      resolve()
    } catch (err) {
      reject(err)
    }
  })

export const createBundle = async (html: string, entry: string) => {
  await trash(DIST_PATH)
  await trash(THEME_PATH)
  await tempFile(INDEX_JS, entry)
  await tempFile(INDEX_HTML, html)

  const bundler = new Bundler(INDEX_HTML, {
    cacheDir: CACHE_PATH,
    outDir: DIST_PATH,
    publicURL: '/',
    outFile: 'index',
  })

  try {
    return await bundler.bundle()
  } catch (err) {
    console.log(err)
    return null
  }
}
