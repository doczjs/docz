import * as prettier from 'prettier';
import logger from 'signale';

export const formatter = (code: string) =>
  prettier.format(code, {
    parser: 'babel',
    semi: true,
    singleQuote: false,
    trailingComma: 'all',
  } as any);

export const format = (code: string): Promise<string> =>
  new Promise((resolve) => {
    try {
      const result = formatter(code);

      resolve(result);
    } catch (err) {
      logger.fatal(err);
      resolve(code);
    }
  });
