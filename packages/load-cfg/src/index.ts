import * as fs from 'fs-extra'
import * as path from 'path'
import findup from 'find-up'
import merge from 'deepmerge'
import esm from 'esm'

export const loadFile = (filepath: string, noCache?: boolean) => {
  let file
  const require = esm(module, {
    mode: 'auto',
    cache: !noCache,
    cjs: {
      cache: !noCache,
      namedExports: true,
      vars: true,
    },
  })

  if (noCache && filepath) {
    delete require.cache[path.resolve(filepath)]
  }

  try {
    const isJS = path.extname(filepath) === '.js'

    if (isJS) {
      const required = require(filepath)
      file = required.default || required
    } else {
      file = fs.readJsonSync(filepath, { encoding: 'utf-8' })
    }
  } catch (err) {
    console.warn('There was an error loading your config:\n')
    console.warn(err)
  }

  return file
}

export const finds = (name: string): string[] => [
  `${name}.json`,
  `.${name}rc`,
  `${name}rc.js`,
  `${name}rc.json`,
  `${name}.config.js`,
  `${name}.config.json`,
]

export function load<C = any>(
  name: string,
  defaultConfig: C,
  noCache?: boolean,
  deep?: boolean
): C {
  let file = {}
  const filepath = findup.sync(finds(name))
  if (filepath) file = loadFile(filepath, noCache)

  // tslint:disable
  return defaultConfig
    ? deep
      ? merge(defaultConfig, file)
      : Object.assign({}, defaultConfig, file)
    : file
}

export function loadFrom<C = any>(
  filePath: string,
  defaultConfig: C,
  noCache?: boolean,
  deep?: boolean
): C {
  const file = loadFile(filePath, noCache)

  // tslint:disable
  return defaultConfig
    ? deep
      ? merge(defaultConfig, file)
      : Object.assign({}, defaultConfig, file)
    : file
}
