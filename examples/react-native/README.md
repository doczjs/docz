# Docz with React-native

### Additional dependencies
* react-native-web

Just following the (react-native-web)[https://github.com/necolas/react-native-web/blob/master/packages/website/guides/getting-started.md] guide:

```javascript
// doczrc.js

export default {
  modifyBabelRc: config => {
    config.plugins = [
      [
        `module-resolver`,
        {
          alias: {
            '^react-native$': `react-native-web`,
          },
        },
      ],
    ];
    return config;
  },
  modifyBundlerConfig: config => {
    config.resolve.alias = {
      'react-native$': `react-native-web`,
    };
    return config;
  },
};
```
