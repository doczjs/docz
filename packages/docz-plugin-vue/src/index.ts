import { createPlugin } from 'docz-core'
import { VueLoaderPlugin } from 'vue-loader'

interface BabelRC {
  presets?: any[]
  plugins?: any[]
  cacheDirectory?: boolean
  babelrc?: boolean
}

export const doczPluginVue = () =>
  createPlugin({
    modifyBabelRc: (babelrc: BabelRC): BabelRC => {
      if (babelrc.plugins === undefined) {
        babelrc.plugins = []
      }
      babelrc.plugins.push('vuera/babel')
      babelrc.babelrc = true
      return babelrc
    },

    modifyBundlerConfig: (config) => {
      config.module.rules.push({
        test: /\.vue$/,
        use: 'vue-loader',
        exclude: /node_modules/
      })

      config.module.rules.push({
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
        exclude: /node_modules/
      })

      config.plugins.push(new VueLoaderPlugin())

      return config
    },
  })
