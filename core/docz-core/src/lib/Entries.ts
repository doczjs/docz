import * as path from 'path'
import * as logger from 'signale'
import { parseMdx } from 'docz-utils/lib/mdast'
import { isRegExp, isString } from 'lodash/fp'
import minimatch from 'minimatch'
import glob from 'fast-glob'

import * as paths from '../config/paths'

import { Entry, EntryObj } from './Entry'
import { Plugin } from './Plugin'
import { Config } from '../config/argv'
import { getRepoEditUrl } from '../utils/repo-info'

const mapToObj = (map: Map<any, any>) =>
  Array.from(map.entries()).reduce(
    (obj, [key, value]) => ({ ...obj, [`${key}`]: value }),
    {}
  )

const matchFilesWithSrc = (config: Config) => (files: string[]) => {
  const src = path.relative(paths.root, config.src)
  return files.map(file => (file.startsWith(src) ? file : path.join(src, file)))
}

export type EntryMap = Record<string, EntryObj>

export class Entries {
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
