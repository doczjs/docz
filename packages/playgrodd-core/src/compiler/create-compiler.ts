import * as fs from 'fs'
import * as mkdir from 'mkdirp'
import * as del from 'del'
import * as webpack from 'webpack'

import { IEntryObj } from './files-parser'
import { createConfig } from './create-config'
import { generateApp, generateHtml, generateJs } from './generate-files'
import * as paths from '../config/paths'

const createTempDir = (): void => {
  try {
    fs.lstatSync(paths.PLAYGRODD)
  } catch (err) {
    mkdir.sync(paths.PLAYGRODD)
  }
}

const tempFile = (filepath: string, content: string) => {
  createTempDir()
  fs.writeFileSync(filepath, content, 'utf-8')
}

export const createCompiler = async (entries: IEntryObj[]) => {
  const app = generateApp(entries)
  const js = generateJs()
  const html = generateHtml()
  const webpackConfig = await createConfig(entries)

  await del.sync(paths.PLAYGRODD)
  tempFile(paths.APP_JS, app)
  tempFile(paths.INDEX_JS, js)
  tempFile(paths.INDEX_HTML, html)

  return webpack(webpackConfig)
}
