import * as fs from 'fs-extra'
import * as glob from 'fast-glob'
import * as path from 'path'

import * as paths from './config/paths'
import { touch, compiled } from './utils/fs'
import { mapToObj } from './utils/helpers'

import { Entry, EntryObj, parseMdx } from './Entry'
import { Plugin } from './Plugin'
import { Config } from './commands/args'

const fromTemplates = (file: string) => path.join(paths.templates, file)

const getHtmlFilepath = (indexHtml: string | undefined) =>
  indexHtml ? path.join(paths.root, indexHtml) : fromTemplates('index.tpl.html')

const getPublicUrl = (config: Config, dev: boolean): string => {
  const prefix = config.base === '/' ? '' : config.base
  return dev ? prefix : `${prefix}/public`
}

const writeAppFiles = async (config: Config, dev: boolean): Promise<void> => {
  const { plugins, title, description, theme, indexHtml } = config
  const props = Plugin.propsOfPlugins(plugins)

  const onPreRenders = props('onPreRender')
  const onPostRenders = props('onPostRender')

  const root = await compiled(fromTemplates('root.tpl.js'))
  const js = await compiled(fromTemplates('index.tpl.js'))
  const html = await compiled(getHtmlFilepath(indexHtml))
  const websocketUrl = `ws://${config.websocketHost}:${config.websocketPort}`

  const rawRootJs = root({
    theme,
    isProd: !dev,
    wrapper: config.wrapper,
    hashRouter: config.hashRouter,
    websocketUrl,
  })

  const rawIndexJs = js({
    onPreRenders,
    onPostRenders,
  })

  const rawIndexHtml = html({
    title,
    description,
    publicUrl: getPublicUrl(config, dev),
  })

  await touch(paths.rootJs, rawRootJs)
  await touch(paths.indexJs, rawIndexJs)
  await touch(paths.indexHtml, rawIndexHtml)
}

const writeImports = async (map: EntryMap): Promise<void> => {
  const imports = await compiled(fromTemplates('imports.tpl.js'))
  const rawImportsJs = imports({ entries: Object.values(map) })

  await touch(paths.importsJs, rawImportsJs)
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

export type EntryMap = Record<string, EntryObj>

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

  public all: Map<string, EntryObj>
  public get: () => Promise<EntryMap>

  constructor(config: Config) {
    this.all = new Map()
    this.get = async () => this.getMap(config)
  }

  private async getMap(config: Config): Promise<EntryMap> {
    const { src, files: pattern } = config

    const ignoreGlob = '!node_modules'
    const files: string[] = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )

    const createEntry = async (file: string) => {
      const ast = await parseMdx(file)
      const { settings, ...entry } = new Entry(ast, file, src)

      return {
        ...settings,
        ...entry,
      }
    }

    const map = new Map()
    const entries = await Promise.all(files.map(createEntry))

    for (const entry of entries) {
      map.set(entry.filepath, entry)
    }

    this.all = map
    return mapToObj(map)
  }
}
