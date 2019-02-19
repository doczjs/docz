import * as prettier from 'prettier'
import logger from 'signale'

export const formatter = (code: string) =>
  prettier.format(code, {
    parser: 'babel',
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  })

export const format = (code: string): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const result = formatter(code)

      resolve(result)
    } catch (err) {
      logger.fatal(err)
      resolve(err)
    }
  })
