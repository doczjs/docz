import * as prettier from 'prettier'
import logger from 'signale'

export const formatter = (code: string) =>
  prettier.format(code, {
    parser: 'babel',
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  } as any)

export const format = (code: string, formatFiles: boolean): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const result = formatFiles ? formatter(code) : code

      resolve(result)
    } catch (err) {
      logger.fatal(err)
      resolve(code)
    }
  })
