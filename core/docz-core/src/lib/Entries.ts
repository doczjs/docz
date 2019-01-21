import * as path from 'path'
import * as fs from 'fs-extra'
import { parseMdx } from 'docz-utils/lib/mdast'
import { touch, compiled } from 'docz-utils/lib/fs'
import glob from 'fast-glob'
import PrettyError from 'pretty-error'

import * as paths from '../config/paths'

import { Entry, EntryObj } from './Entry'
import { Plugin } from './Plugin'
import { Config } from '../config/argv'
import { getRepoEditUrl } from '../utils/repo-info'

export const fromTemplates = (file: string) => path.join(paths.templates, file)

const pe = new PrettyError()
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

  const root = await compiled(fromTemplates('root.tpl.js'), { minimize: false })
  const js = await compiled(fromTemplates('index.tpl.js'), { minimize: false })
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
    isProd: !dev,
  })

  await fs.remove(paths.rootJs)
  await fs.remove(paths.indexJs)
  await touch(paths.rootJs, rawRootJs)
  await touch(paths.indexJs, rawIndexJs)
}

export type EntryMap = Record<string, EntryObj>

export class Entries {
  public static async writeApp(config: Config, dev?: boolean): Promise<void> {
    await fs.ensureDir(paths.app)
    await writeAppFiles(config, Boolean(dev))
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

    const files = await glob<string>(toMatch(arr), {
      ignore: ['**/node_modules/**'].concat(ignore),
      onlyFiles: true,
      unique: true,
      nocase: true,
      matchBase: true,
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
        console.log(err)
        config.debug && pe.render(err)
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
