import * as fs from 'fs-extra'
import * as path from 'path'
import * as findup from 'find-up'
import { merge } from 'lodash/fp'

export const loadFile = (filepath: string, noCache?: boolean) => {
  require('@babel/register')({
    cache: !noCache,
    presets: [['@babel/preset-env', { modules: 'commonjs' }]],
  })

  let file

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
  const filepath = findup.sync(finds(name))
  const file = filepath ? loadFile(filepath, noCache) : {}
  return defaultConfig
    ? deep
      ? merge(defaultConfig, file)
      : { ...defaultConfig, ...file }
    : file
}

export function loadFrom<C = any>(
  filePath: string,
  defaultConfig: C,
  noCache?: boolean,
  deep?: boolean
): C {
  const file = loadFile(filePath, noCache)
  return defaultConfig
    ? deep
      ? merge(defaultConfig, file)
      : { ...defaultConfig, ...file }
    : file
}
