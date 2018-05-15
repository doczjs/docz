import * as prettier from 'prettier'

export const format = (code: string): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const result = prettier.format(code, {
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
      })

      resolve(result)
    } catch (err) {
      console.log(err)
      resolve(err)
    }
  })
