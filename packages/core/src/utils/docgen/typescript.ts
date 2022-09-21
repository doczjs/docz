import crypto from 'crypto';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import reactDocgenTs from 'react-docgen-typescript';
import logger from 'signale';
import ts from 'typescript';
import type {
  CompilerOptions,
  LanguageService,
  LanguageServiceHost,
  ParsedCommandLine,
  SourceFile,
} from 'typescript';

import * as paths from '~/config/paths';
import type { Config } from '~/types';

export const unixPath = (src: string): string => {
  return path.normalize(src).replace(/\\/g, '/');
};

export interface TSFile {
  text?: string;
  version: number;
}

interface PropItem {
  key: string;
  value: any[];
}

const digest = (str: string) =>
  crypto.createHash('md5').update(str).digest('hex');

const cacheFilepath = path.join(paths.cache, 'propsParser.json');
export const readCacheFile = () =>
  fs.readJSONSync(cacheFilepath, { throws: false });

function checkFilesOnCache(files: string[], config: Config): string[] {
  const cache = readCacheFile();
  const root = config.paths.root;
  if (_.isEmpty(cache)) return files;
  return files.filter((filepath) => {
    const normalized = path.normalize(filepath);
    const fullpath = path.resolve(root, normalized);
    const hash = digest(fs.readFileSync(fullpath, 'utf-8'));
    const found = _.get(cache, normalized);
    return found && hash !== found.hash;
  });
}

function writePropsOnCache(items: PropItem[], config: Config): void {
  const cache = readCacheFile();
  const root = config.paths.root;
  const newCache = items.reduce((obj, { key: filepath, value }) => {
    const fullpath = path.resolve(root, path.normalize(filepath));
    const hash = digest(fs.readFileSync(fullpath, 'utf-8'));
    return { ...obj, [unixPath(filepath)]: { hash, props: value } };
  }, {});

  fs.outputJSONSync(cacheFilepath, { ...cache, ...newCache });
}

function getPropsOnCache() {
  const cache = readCacheFile();
  if (_.isEmpty(cache)) {
    logger.warn('No cache was found with your props definitions');
    logger.warn("We'll parse your components to get props from them");
    logger.warn('Depending on your components, this could take while...\n');
    return [];
  }

  return Object.entries(cache).map(([key, value]) => ({
    key: unixPath(key),
    value: _.get(value, 'props'),
  }));
}

const mergeWithCache = (cache: any[], props: any[]) => {
  const keys = props.map((k) => k.key);
  return cache.filter((item) => keys.some((k) => k === item.key)).concat(props);
};

const removeFromCache = (filepath: string) => {
  const cache = readCacheFile();
  fs.outputJSONSync(cacheFilepath, _.omit(cache, filepath));
};

const getInitialFilesMap = (): Map<string, TSFile> => {
  const cache = readCacheFile();
  if (_.isEmpty(cache)) return new Map<string, TSFile>();
  const map = new Map();
  _.entries(cache).forEach(([filepath]: any) => {
    const exist = fs.pathExistsSync(filepath);
    if (!exist) {
      removeFromCache(filepath);
    } else {
      map.set(filepath, {
        text: fs.readFileSync(filepath, 'utf-8'),
        version: 0,
      });
    }
  });
  return map;
};

let languageService: LanguageService | null = null;
const filesMap = getInitialFilesMap();

function getTSConfigFile(tsconfigPath: string): ParsedCommandLine {
  const basePath = path.dirname(tsconfigPath);
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(
    configFile!.config,
    ts.sys,
    basePath,
    {},
    tsconfigPath
  );
}

function loadFiles(filesToLoad: string[], config: Config): void {
  const root = config.paths.root;
  filesToLoad.forEach((filepath) => {
    const normalized = path.normalize(filepath);
    const fullpath = path.resolve(root, normalized);
    const found = filesMap.get(normalized);
    filesMap.set(normalized, {
      text: fs.readFileSync(fullpath, 'utf-8'),
      version: found ? found.version + 1 : 0,
    });
  });
}

function createServiceHost(
  compilerOptions: CompilerOptions,
  files: Map<string, TSFile>,
  config: Config
): LanguageServiceHost {
  const root = config.paths.root;
  return {
    getScriptFileNames: () => {
      return [...files.keys()];
    },
    getScriptVersion: (fileName) => {
      const file = files.get(fileName);
      return (file && file.version.toString()) || '';
    },
    getScriptSnapshot: (fileName) => {
      const fullpath = path.resolve(root, fileName);
      if (!fs.existsSync(fullpath)) {
        return undefined;
      }

      let file = files.get(fileName);
      if (file === undefined) {
        const text = fs.readFileSync(fullpath).toString();

        file = { version: 0, text };
        files.set(fileName, file);
      }

      return ts.ScriptSnapshot.fromString(file!.text!);
    },
    getCurrentDirectory: () => root,
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
  };
}

const defaultPropFilter = (prop: any): boolean => {
  return prop.parent == null || !prop.parent.fileName.includes('node_modules');
};

const parseFiles = (files: string[], config: Config, tsconfig: string) => {
  const opts = {
    propFilter(prop: any): boolean {
      const customPropFilter = config.docgenConfig.propFilter;
      const propFilter =
        customPropFilter && _.isFunction(customPropFilter)
          ? customPropFilter
          : defaultPropFilter;

      return Boolean(propFilter(prop));
    },
    componentNameResolver(exp: any, source: SourceFile): any {
      const componentNameResolver = config.docgenConfig.resolver;
      const val =
        componentNameResolver &&
        _.isFunction(componentNameResolver) &&
        componentNameResolver(exp, source);
      return val;
    },
  };

  loadFiles(files, config);
  const parser = reactDocgenTs.withCustomConfig(tsconfig, opts);
  const compilerOptions = _.get(getTSConfigFile(tsconfig), 'options');

  const programProvider = () => {
    if (languageService) return languageService.getProgram()!;
    const servicesHost = createServiceHost(compilerOptions, filesMap, config);
    const documentRegistry = ts.createDocumentRegistry();
    languageService = ts.createLanguageService(servicesHost, documentRegistry);
    return languageService.getProgram()!;
  };

  return files.map((filepath) => ({
    key: unixPath(filepath),
    value: parser.parseWithProgramProvider(filepath, programProvider),
  }));
};

export const tsParser = (
  files: string[],
  config: Config,
  tsconfig?: string
) => {
  if (!tsconfig) return [];
  const filesToLoad = checkFilesOnCache(files, config);
  const propsOnCache = getPropsOnCache();
  if (!filesToLoad.length) return propsOnCache;

  const next = parseFiles(filesToLoad, config, tsconfig);
  writePropsOnCache(next, config);
  return mergeWithCache(propsOnCache, next);
};
