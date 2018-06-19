import { BabelRC, createPlugin } from 'docz-core'
import HappyPack from 'happypack'

const findHappypackJsx = (plugin: any) => plugin.config.id === 'jsx'
const findHappypackMdx = (plugin: any) => plugin.config.id === 'mdx'
const findTsxRule = (rule: any) => rule.test.toString() === '/\\.(ts|tsx)$/'

const modifyHappypackLoader = (plugin: any) => {
  plugin.config.loaders[0].loader = require.resolve('babel-loader')
}

export const babel = () =>
  createPlugin({
    modifyBabelRc: (babelrc: BabelRC) => {
      if (!babelrc.presets) return babelrc

      const idx = babelrc.presets.findIndex(preset =>
        /babel-preset-react-app/.test(preset)
      )

      const tsIdx = babelrc.presets.findIndex(preset =>
        /@babel\/preset-typescript/.test(preset)
      )

      babelrc.presets[idx] = require.resolve('babel-preset-react-app')
      tsIdx > -1 && babelrc.presets.splice(tsIdx, 1)

      return babelrc
    },
    modifyBundlerConfig: config => {
      const happypackJsx = config.plugins.findIndex(findHappypackJsx)
      const happypackMdx = config.plugins.findIndex(findHappypackMdx)
      const tsxRule = config.module.rules.find(findTsxRule)
      const tsxIdx = config.module.rules.findIndex(findTsxRule)

      modifyHappypackLoader(config.plugins[happypackJsx])
      modifyHappypackLoader(config.plugins[happypackMdx])

      if (tsxRule) {
        config.module.rules[tsxIdx] = {
          ...tsxRule,
          use: 'happypack/loader?id=tsx',
        }

        config.plugins.push(
          new HappyPack({
            id: 'tsx',
            loaders: [
              {
                loader: require.resolve('ts-loader'),
                options: {
                  happyPackMode: true,
                },
              },
            ],
          })
        )
      }

      return config
    },
  })
