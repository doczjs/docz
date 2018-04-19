import * as prettier from 'prettier'

export const format = (code: string): string =>
  prettier.format(code, {
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  })
