import * as fs from 'fs-extra'
import * as path from 'path'
import * as crypto from 'crypto'
import * as _ from 'lodash/fp'
import * as logger from 'signale'
import * as reactDocgenTs from 'react-docgen-typescript'
import ts from 'typescript'

import { Config } from '../../config/argv'
import * as paths from '../../config/paths'
import { unixPath } from '.'

export interface TSFile {
  text?: string
  version: number
}

interface PropItem {
  key: string
  value: any[]
}

const digest = (str: string) =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

const cacheFilepath = path.join(paths.cache, 'propsParser.json')
export const readCacheFile = () =>
  fs.readJSONSync(cacheFilepath, { throws: false })

function checkFilesOnCache(files: string[], config: Config): string[] {
  const cache = readCacheFile()
  const root = paths.getRootDir(config)
  if (_.isEmpty(cache)) return files
  return files.filter(filepath => {
    const normalized = path.normalize(filepath)
    const fullpath = path.resolve(root, normalized)
    const hash = digest(fs.readFileSync(fullpath, 'utf-8'))
    const found = _.get(normalized, cache)
    return found && hash !== found.hash
  })
}

function writePropsOnCache(items: PropItem[], config: Config): void {
  const cache = readCacheFile()
  const root = paths.getRootDir(config)
  const newCache = items.reduce((obj, { key: filepath, value }) => {
    const fullpath = path.resolve(root, path.normalize(filepath))
    const hash = digest(fs.readFileSync(fullpath, 'utf-8'))
    return { ...obj, [unixPath(filepath)]: { hash, props: value } }
  }, {})

  fs.outputJSONSync(cacheFilepath, { ...cache, ...newCache })
}

function getPropsOnCache(): any {
  const cache = readCacheFile()
  if (_.isEmpty(cache)) {
    logger.warn('Any cache was found with your props definitions')
    logger.warn("We'll parse your components to get props from them")
    logger.warn('Depending on your components, this could take while...')
    return []
  }

  return Object.entries(cache).map(([key, value]) => ({
    key: unixPath(key),
    value: _.get('props', value),
  }))
}

const mergeWithCache = (cache: any[], props: any[]) => {
  const keys = props.map(_.prop('key'))
  return cache.filter(item => !_.contains(item.key, keys)).concat(props)
}

const removeFromCache = (filepath: string) => {
  const cache = readCacheFile()
  fs.outputJSONSync(cacheFilepath, _.omit(filepath, cache))
}

const getInitialFilesMap = (): Map<string, TSFile> => {
  const cache = readCacheFile()
  if (_.isEmpty(cache)) return new Map<string, TSFile>()
  const map = new Map()
  _.entries(cache).forEach(([filepath]: any) => {
    const exist = fs.pathExistsSync(filepath)
    if (!exist) {
      removeFromCache(filepath)
    } else {
      map.set(filepath, {
        text: fs.readFileSync(filepath, 'utf-8'),
        version: 0,
      })
    }
  })
  return map
}

let languageService: ts.LanguageService | null = null
const filesMap = getInitialFilesMap()

function getTSConfigFile(tsconfigPath: string): ts.ParsedCommandLine {
  const basePath = path.dirname(tsconfigPath)
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
  return ts.parseJsonConfigFileContent(
    configFile!.config,
    ts.sys,
    basePath,
    {},
    tsconfigPath
  )
}

function loadFiles(filesToLoad: string[], config: Config): void {
  const root = paths.getRootDir(config)
  filesToLoad.forEach(filepath => {
    const normalized = path.normalize(filepath)
    const fullpath = path.resolve(root, normalized)
    const found = filesMap.get(normalized)
    filesMap.set(normalized, {
      text: fs.readFileSync(fullpath, 'utf-8'),
      version: found ? found.version + 1 : 0,
    })
  })
}

function createServiceHost(
  compilerOptions: ts.CompilerOptions,
  files: Map<string, TSFile>,
  config: Config
): ts.LanguageServiceHost {
  const root = paths.getRootDir(config)
  return {
    getScriptFileNames: () => {
      return [...files.keys()]
    },
    getScriptVersion: fileName => {
      const file = files.get(fileName)
      return (file && file.version.toString()) || ''
    },
    getScriptSnapshot: fileName => {
      const fullpath = path.resolve(root, fileName)
      if (!fs.existsSync(fullpath)) {
        return undefined
      }

      let file = files.get(fileName)
      if (file === undefined) {
        const text = fs.readFileSync(fullpath).toString()

        file = { version: 0, text }
        files.set(fileName, file)
      }

      return ts.ScriptSnapshot.fromString(file!.text!)
    },
    getCurrentDirectory: () => root,
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
  }
}

const parseFiles = (files: string[], config: Config, tsconfig: string) => {
  const opts = {
    propFilter(prop: any): any {
      if (prop.parent == null) return true
      const propFilter = config.docgenConfig.propFilter
      const val = propFilter && _.isFunction(propFilter) && propFilter(prop)
      return !prop.parent.fileName.includes('node_modules') || Boolean(val)
    },
    componentNameResolver(exp: ts.Symbol, source: ts.SourceFile): any {
      const componentNameResolver = config.docgenConfig.resolver
      const val =
        componentNameResolver &&
        _.isFunction(componentNameResolver) &&
        componentNameResolver(exp, source)
      return val
    },
  }

  loadFiles(files, config)
  const parser = reactDocgenTs.withCustomConfig(tsconfig, opts)
  const compilerOptions = _.get('options', getTSConfigFile(tsconfig))

  const programProvider = () => {
    if (languageService) return languageService.getProgram()!
    const servicesHost = createServiceHost(compilerOptions, filesMap, config)
    const documentRegistry = ts.createDocumentRegistry()
    languageService = ts.createLanguageService(servicesHost, documentRegistry)
    return languageService.getProgram()!
  }

  return files.map(filepath => ({
    key: unixPath(filepath),
    value: parser.parseWithProgramProvider(filepath, programProvider),
  }))
}

export const tsParser = (
  files: string[],
  config: Config,
  tsconfig?: string
) => {
  if (!tsconfig) return []
  const filesToLoad = checkFilesOnCache(files, config)
  const propsOnCache = getPropsOnCache()
  if (!filesToLoad.length) return propsOnCache

  const next = parseFiles(filesToLoad, config, tsconfig)
  writePropsOnCache(next, config)
  return mergeWithCache(propsOnCache, next)
}
