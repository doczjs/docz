import * as prettier from 'prettier'

export const format = (code: string): string => {
  try {
    return prettier.format(code, {
      semi: false,
      singleQuote: true,
      trailingComma: 'all',
    })
  } catch (err) {
    console.log(err)
    process.exit(1)
    return ''
  }
}
