import * as fs from 'fs'
import * as mkdir from 'mkdirp'
import * as del from 'del'
import * as webpack from 'webpack'

import { IEntryObj } from './files-parser'
import { createConfig } from './create-config'
import { generateHtml, generateJs } from './generate-files'
import * as paths from '../config/paths'

const checkMkdirTheme = (): void => {
  try {
    fs.lstatSync(paths.THEME)
  } catch (err) {
    mkdir.sync(paths.THEME)
  }
}

const tempFile = (filepath: string, content: string) => {
  checkMkdirTheme()
  fs.writeFileSync(filepath, content, 'utf-8')
}

export const createCompiler = async (entries: IEntryObj[]) => {
  const js = generateJs()
  const html = generateHtml()
  const webpackConfig = await createConfig(entries)

  await del.sync(paths.THEME)
  tempFile(paths.INDEX_JS, js)
  tempFile(paths.INDEX_HTML, html)

  return webpack(webpackConfig)
}
