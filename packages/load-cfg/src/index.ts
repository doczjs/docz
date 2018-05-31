import * as fs from 'fs'
import * as path from 'path'
import findup from 'find-up'
import merge from 'deepmerge'
import esm from 'esm'

export const finds = (name: string): string[] => [
  `${name}.json`,
  `.${name}rc`,
  `${name}rc.js`,
  `${name}rc.json`,
  `${name}.config.js`,
  `${name}.config.json`,
]

export const loadFile = (
  filepath: string,
  defaultFile: any = {},
  noCache?: boolean
) => {
  let file
  const require = esm(module, {
    cache: !noCache,
    cjs: {
      cache: !noCache,
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
      file = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
    }
  } catch (err) {
    file = defaultFile
  }

  return file
}

export const load = (
  name: string,
  defaultConfig: any = {},
  noCache?: boolean
) => {
  let file = {}
  const filepath = findup.sync(finds(name))

  if (filepath) {
    file = loadFile(filepath, defaultConfig, noCache)
  }

  return defaultConfig !== null ? merge(defaultConfig, file) : file
}
