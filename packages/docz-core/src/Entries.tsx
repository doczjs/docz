import * as path from 'path'
import * as fs from 'fs-extra'
import * as glob from 'fast-glob'

import * as paths from './config/paths'
import { touch, compiled } from './utils/fs'
import { mapToObj } from './utils/helpers'

import { Entry, EntryObj, parseMdx } from './Entry'
import { Plugin } from './Plugin'
import { Config } from './commands/args'
import { repoInfo } from './utils/repo-info'

export const fromTemplates = (file: string) => path.join(paths.templates, file)

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
    isProd: !dev,
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

export type EntryMap = Record<string, EntryObj>

export class Entries {
  public static async writeApp(config: Config, dev?: boolean): Promise<void> {
    await fs.ensureDir(paths.app)
    await writeAppFiles(config, Boolean(dev))
  }

  public all: Map<string, EntryObj>
  public get: () => Promise<EntryMap>
  public repoUrl: string | null

  constructor(config: Config) {
    this.repoUrl = repoInfo(config.src)
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
      const entry = new Entry(ast, file, src)

      if (this.repoUrl) entry.setLink(this.repoUrl)
      const { settings, ...rest } = entry

      return {
        ...settings,
        ...rest,
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
