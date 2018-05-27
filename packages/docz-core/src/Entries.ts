import * as glob from 'fast-glob'
import * as path from 'path'

import * as paths from './config/paths'
import { propOf } from './utils/helpers'
import { mkd, touch, compiled } from './utils/fs'

import { Entry, parseMdx } from './Entry'
import { Config } from './commands/args'

const fromTemplates = (file: string) => path.join(paths.templates, file)

const writeAppFiles = async (config: Config): Promise<void> => {
  const { plugins, title, description, theme } = config

  const wrappers = propOf(plugins, 'wrapper')
  const afterRenders = propOf(plugins, 'afterRender')
  const beforeRenders = propOf(plugins, 'beforeRender')

  const root = await compiled(fromTemplates('root.tpl.js'))
  const js = await compiled(fromTemplates('index.tpl.js'))
  const html = await compiled(fromTemplates('index.tpl.html'))

  const rawRootJs = root({
    theme,
    wrappers,
    websocketUrl: `ws://${config.websocketHost}:${config.websocketPort}`,
  })

  const rawIndexJs = js({
    afterRenders,
    beforeRenders,
  })

  const rawIndexHtml = html({
    title,
    description,
  })

  await touch(paths.rootJs, rawRootJs)
  await touch(paths.indexJs, rawIndexJs)
  await touch(paths.indexHtml, rawIndexHtml)
}

const writeImports = async (entries: EntryMap): Promise<void> => {
  const imports = await compiled(fromTemplates('imports.tpl.js'))
  await touch(paths.importsJs, imports({ entries }))
}

export type EntryMap = Record<string, Entry>

export class Entries {
  public static async writeApp(config: Config): Promise<void> {
    mkd(paths.app)
    await writeAppFiles(config)
  }

  public static async writeImports(entries: EntryMap): Promise<void> {
    await writeImports(entries)
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
