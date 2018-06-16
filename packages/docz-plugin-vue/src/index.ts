import { createPlugin } from 'docz-core'

interface BabelRC {
  presets?: any[]
  plugins?: any[]
  cacheDirectory?: boolean
  babelrc?: boolean
}

type ModifyBabelRC = (babelrc: BabelRC) => BabelRC
type ModifyBundlerConfig<C = any> = (config: C, dev: boolean) => C

export const doczPluginVue = () =>
  createPlugin({
    modifyBabelRc: ((babelrc: BabelRC): BabelRC => {
      if (babelrc.plugins === undefined) {
        babelrc.plugins = []
      }
      babelrc.plugins.push('vuera/babel')
      babelrc.babelrc = true
      return babelrc
    }) as ModifyBabelRC,
    modifyBundlerConfig: (config => {
      config.module.rules.push({
        test: /\.vue$/,
        use: 'vue-loader',
      })
      return config
    }) as ModifyBundlerConfig,
  })
