import { createPlugin } from 'docz-core'

export interface Options {
  [key: string]: any
}

const defaultOptions = {
  icon: true,
}

export const svgr = (options: Options = defaultOptions) =>
  createPlugin({
    modifyBundlerConfig: config => {
      const rule = config.module.rules.find(
        (rule: any) => rule.test.toString() === '/\\.(svg)(\\?.*)?$/'
      )

      rule.use.unshift({
        loader: '@svgr/webpack',
        options,
      })

      return config
    },
  })
