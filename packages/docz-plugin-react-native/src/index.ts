import { createPlugin } from 'docz-core'

export const reactNative = () =>
  createPlugin({
    modifyBundlerConfig: config => {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'react-native$': `react-native-web`,
      }

      return config
    },
  })
