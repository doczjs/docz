import Config from 'webpack-chain'
import * as TerserPlugin from 'terser-webpack-plugin'

export const minifier = (config: Config) => {
  config.optimization.minimizer('js').use(TerserPlugin, [
    {
      terserOptions: {
        parse: {
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true,
        },
      },
      cache: true,
      parallel: true,
      sourceMap: true,
    },
  ])
}
