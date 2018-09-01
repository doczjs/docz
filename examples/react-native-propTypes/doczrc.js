export default {
  modifyBabelRc: config => {
    config.plugins = [
      ...config.plugins,
      [
        `module-resolver`,
        {
          alias: {
            '^react-native$': `react-native-web`,
          },
        },
      ],
    ]
    return config
  },
  modifyBundlerConfig: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': `react-native-web`,
    }
    return config
  },
}