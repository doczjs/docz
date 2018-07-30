import * as prettier from 'prettier'
import logger from 'signale'

export const format = (code: string): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const result = prettier.format(code, {
        parser: 'babylon',
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
      })

      resolve(result)
    } catch (err) {
      logger.fatal(err)
      resolve(err)
    }
  })
