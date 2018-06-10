import * as React from 'react'
import * as fs from 'fs-extra'
import * as glob from 'fast-glob'
import * as path from 'path'
import { renderToString } from 'react-dom/server'

import * as paths from './config/paths'
import { touch, compiled } from './utils/fs'

import { Entry, parseMdx } from './Entry'
import { Plugin } from './Plugin'
import { Config } from './commands/args'
import { Html } from './components/Html'

const fromTemplates = (file: string) => path.join(paths.templates, file)

const writeAppFiles = async (config: Config, dev: boolean): Promise<void> => {
  const { plugins, title, description, theme } = config
  const props = Plugin.propsOfPlugins(plugins)
  const html = renderToString(<Html title={title} description={description} />)

  const onPreRenders = props('onPreRender')
  const onPostRenders = props('onPostRender')

  const root = await compiled(fromTemplates('root.tpl.js'))
  const js = await compiled(fromTemplates('index.tpl.js'))

  const rawRootJs = root({
    theme,
    isProd: !dev,
    wrapper: config.wrapper,
    websocketUrl: `ws://${config.websocketHost}:${config.websocketPort}`,
  })

  const rawIndexJs = js({
    onPreRenders,
    onPostRenders,
  })

  await touch(paths.rootJs, rawRootJs)
  await touch(paths.indexJs, rawIndexJs)
  await touch(paths.indexHtml, `<!DOCTYPE html>${html}`)
}

const writeImports = async (map: EntryMap): Promise<void> => {
  const imports = await compiled(fromTemplates('imports.tpl.js'))
  await touch(paths.importsJs, imports({ entries: Object.values(map) }))
}

const writeData = async (map: EntryMap, config: Config): Promise<void> => {
  const configObj = {
    title: config.title,
    description: config.description,
    ...config.themeConfig,
  }

  await touch(paths.entriesJson, JSON.stringify(map, null, 2))
  await touch(paths.configJson, JSON.stringify(configObj, null, 2))
}

export type EntryMap = Record<string, Entry>

export class Entries {
  public static async writeApp(config: Config, dev?: boolean): Promise<void> {
    await fs.ensureDir(paths.app)
    await writeAppFiles(config, Boolean(dev))
  }

  public static async writeImports(map: EntryMap): Promise<void> {
    await writeImports(map)
  }

  public static async writeData(map: EntryMap, config: Config): Promise<void> {
    await writeData(map, config)
  }

  public all: EntryMap
  public getMap: () => Promise<EntryMap>

  constructor(config: Config) {
    this.all = {}

    this.getMap = async () => {
      this.all = await this.get(config)
      return this.all
    }
  }

  private async get(config: Config): Promise<EntryMap> {
    const { src, files: pattern } = config

    const ignoreGlob = '!node_modules'
    const files: string[] = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )

    const isEntry = async (file: string) => Entry.check(file)

    const createEntry = async (file: string) => {
      const ast = await parseMdx(file)
      return new Entry(ast, file, src)
    }

    const filesToReduce = await Promise.all(
      files.filter(isEntry).map(createEntry)
    )

    const reducer = (obj: EntryMap, entry: Entry) => ({
      ...obj,
      [entry.filepath]: entry,
    })

    return filesToReduce.reduce(reducer, {})
  }
}
