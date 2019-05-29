import * as path from 'path'
import * as logger from 'signale'
import { parseMdx } from 'docz-utils/lib/mdast'
import { isRegExp, isString } from 'lodash/fp'
import minimatch from 'minimatch'
import glob from 'fast-glob'

import { Entry, EntryObj } from './Entry'
import { Plugin } from './Plugin'
import { Config } from '../config/argv'
import { getRepoEditUrl } from '../utils/repo-info'

const mapToObj = (map: Map<any, any>) =>
  Array.from(map.entries()).reduce(
    (obj, [key, value]) => ({ ...obj, [`${key}`]: value }),
    {}
  )

export const matchFilesWithSrc = (config: Config) => (files: string[]) => {
  const { paths, src } = config
  const rootDir = paths.getRootDir(config)
  const srcDir = path.resolve(rootDir, src)
  const prefix = path.relative(rootDir, srcDir)
  return files.map(file =>
    file.startsWith(prefix) ? file : path.join(prefix, file)
  )
}

export const getFilesToMatch = (config: Config) => {
  const { files: pattern } = config
  const arr = Array.isArray(pattern) ? pattern : [pattern]
  const toMatch = matchFilesWithSrc(config)
  return toMatch(arr)
}

export type EntryMap = Record<string, EntryObj>

export class Entries {
  public all: Map<string, EntryObj>
  public get: () => Promise<EntryMap>
  public repoEditUrl: string | null

  constructor(config: Config) {
    this.repoEditUrl = getRepoEditUrl(config)
    this.all = new Map()
    this.get = async () => this.getMap(config)
  }

  private async getMap(config: Config): Promise<EntryMap> {
    const { paths, ignore, plugins, mdPlugins } = config
    const initialFiles = await glob<string>(getFilesToMatch(config), {
      cwd: paths.getRootDir(config),
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

    const rootDir = paths.getRootDir(config)
    const createEntry = async (file: string) => {
      try {
        const fullpath = path.resolve(rootDir, file)
        const ast = await parseMdx(fullpath, mdPlugins)
        const entry = new Entry(ast, file, config)

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
