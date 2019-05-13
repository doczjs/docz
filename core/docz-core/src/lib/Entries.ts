import * as path from 'path'
import * as fs from 'fs-extra'
import * as logger from 'signale'
import { parseMdx } from 'docz-utils/lib/mdast'
import { touch, compiled } from 'docz-utils/lib/fs'
import { isRegExp, isString } from 'lodash/fp'
import minimatch from 'minimatch'
import glob from 'fast-glob'

import * as paths from '../config/paths'

import { Entry, EntryObj } from './Entry'
import { Plugin } from './Plugin'
import { Config } from '../config/argv'
import { getRepoEditUrl } from '../utils/repo-info'

export const fromTemplates = (file: string) => path.join(paths.templates, file)

const mapToObj = (map: Map<any, any>) =>
  Array.from(map.entries()).reduce(
    (obj, [key, value]) => ({ ...obj, [`${key}`]: value }),
    {}
  )

const matchFilesWithSrc = (config: Config) => (files: string[]) => {
  const src = path.relative(paths.root, config.src)
  return files.map(file => (file.startsWith(src) ? file : path.join(src, file)))
}

const writeAppFiles = async (config: Config, dev: boolean): Promise<void> => {
  const { plugins, theme } = config
  const props = Plugin.propsOfPlugins(plugins)

  const onPreRenders = props('onPreRender')
  const onPostRenders = props('onPostRender')

  const isProd = !dev
  const root = await compiled(fromTemplates('root.tpl.js'), { minimize: false })
  const js = await compiled(fromTemplates('index.tpl.js'), { minimize: false })
  const websocketUrl = `ws://${config.websocketHost}:${config.websocketPort}`

  const rawRootJs = root({
    theme,
    isProd,
    wrapper: config.wrapper,
    websocketUrl,
  })

  const rawIndexJs = js({
    onPreRenders,
    onPostRenders,
    isProd,
  })

  await fs.remove(paths.rootJs)
  await fs.remove(paths.indexJs)
  await touch(paths.rootJs, rawRootJs)
  await touch(paths.indexJs, rawIndexJs)
}

export type EntryMap = Record<string, EntryObj>

export class Entries {
  public static async writeApp(config: Config, dev: boolean): Promise<void> {
    await fs.ensureDir(paths.app)
    await writeAppFiles(config, dev)
  }

  public static async writeImports(map: EntryMap): Promise<void> {
    const imports = await compiled(fromTemplates('imports.tpl.js'))
    const rawImportsJs = imports({ entries: Object.values(map) })
    await touch(path.join(paths.app, 'imports.js'), rawImportsJs)
  }

  public all: Map<string, EntryObj>
  public get: () => Promise<EntryMap>
  public repoEditUrl: string | null

  constructor(config: Config) {
    this.repoEditUrl = getRepoEditUrl(config.src, config.editBranch)
    this.all = new Map()
    this.get = async () => this.getMap(config)
  }

  private async getMap(config: Config): Promise<EntryMap> {
    const { src, files: pattern, ignore, plugins, mdPlugins } = config
    const arr = Array.isArray(pattern) ? pattern : [pattern]
    const toMatch = matchFilesWithSrc(config)

    const initialFiles = await glob<string>(toMatch(arr), {
      ignore: ['**/node_modules/**'],
      onlyFiles: true,
      matchBase: false,
      unique: true,
      case: false,
    })

    const files = initialFiles.filter((value: string) => {
      return !ignore.some(pattern => {
        if (isString(pattern)) return minimatch(value, pattern)
        if (isRegExp(pattern)) return pattern.test(value)
        return false
      })
    })

    const createEntry = async (file: string) => {
      try {
        const ast = await parseMdx(file, mdPlugins)
        const entry = new Entry(ast, file, src, config)

        if (this.repoEditUrl) entry.setLink(this.repoEditUrl)
        const { settings, ...rest } = entry

        return {
          ...settings,
          ...rest,
        }
      } catch (err) {
        logger.error(err)
        return null
      }
    }

    const reduce = Plugin.reduceFromPlugins<string[]>(plugins)
    const modifiedFiles = reduce('modifyFiles', files)

    const map = new Map()
    const entries = await Promise.all(
      modifiedFiles.map(createEntry).filter(Boolean)
    )

    for (const entry of entries) {
      if (entry) {
        map.set(entry.filepath, entry)
      }
    }

    this.all = map
    return mapToObj(map)
  }
}
