import * as fs from 'fs'
import * as path from 'path'
import * as findup from 'find-up'
import * as merge from 'deepmerge'

const finds = (name: string): string[] => [
  `${name}.json`,
  `.${name}rc`,
  `${name}rc.js`,
  `${name}rc.json`,
  `${name}rc.yml`,
  `${name}rc.yaml`,
  `${name}.config.js`,
  `${name}.config.json`,
]

export const loadConfig = (name: string, defaultConfig: any = {}) => {
  let file
  const filepath = findup.sync(finds(name))

  if (filepath) {
    try {
      const isJS = path.extname(filepath) === '.js'

      file = isJS
        ? require(filepath)
        : JSON.parse(fs.readFileSync(filepath, 'utf-8'))
    } catch (err) {
      // console.log(err)
      file = defaultConfig
    }
  }

  return defaultConfig !== null ? merge(defaultConfig, file) : file
}
