import * as fs from 'fs'
import * as mkdir from 'mkdirp'
import * as del from 'del'
import * as webpack from 'webpack'
import * as webpackDevServerUtils from 'react-dev-utils/WebpackDevServerUtils'

import { IEntryObj } from './files-parser'
import { createConfig } from './create-config'
import { generateApp, generateHtml, generateJs } from './generate-files'

import { PORT, HOST } from '../config/dev-server'
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
  const config = await createConfig(entries)
  const appName = require(paths.PACKAGE_JSON).name
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const urls = webpackDevServerUtils.prepareUrls(protocol, HOST, PORT)

  await del.sync(paths.PLAYGRODD)
  tempFile(paths.APP_JS, app)
  tempFile(paths.INDEX_JS, js)
  tempFile(paths.INDEX_HTML, html)

  return webpackDevServerUtils.createCompiler(
    webpack,
    config,
    appName,
    urls,
    true
  )
}
