import * as fs from 'fs'
import mkdir from 'mkdirp'
import trash from 'trash'
import webpack from 'webpack'

import * as paths from './paths'
import { IEntryObj } from './files-parser'
import { createConfig } from './create-config'
import { generateHtml, generateJs } from './generate-files'

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

  await trash(paths.THEME)
  tempFile(paths.INDEX_JS, js)
  tempFile(paths.INDEX_HTML, html)

  return webpack(webpackConfig)
}
