/* eslint-disable no-console */
import prettier from 'prettier';

export const formatter = (code: string) =>
  prettier.format(code, {
    parser: 'babel',
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  });

export const format = (code: string): Promise<string> =>
  new Promise((resolve) => {
    try {
      const result = formatter(code);

      resolve(result);
    } catch (err) {
      console.error(err);
      resolve(code);
    }
  });
