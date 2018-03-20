import fs from 'fs'
import mkdir from 'mkdirp'
import trash from 'trash'
import webpack from 'webpack'

import * as paths from './paths'
import { config } from './config'
import { IComponentMap } from '../utils/components'
import { generateHtml, generateJs } from './generate-files'

export { config as devServerConfig } from './dev-server'

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

export const createCompiler = async (components: IComponentMap) => {
  const js = generateJs()
  const html = generateHtml()
  const webpackConfig = await config(components)

  await trash(paths.THEME)
  tempFile(paths.INDEX_JS, js)
  tempFile(paths.INDEX_HTML, html)

  return webpack(webpackConfig)
}
