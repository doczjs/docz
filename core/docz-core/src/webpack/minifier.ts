import Config from 'webpack-chain'
import * as TerserPlugin from 'terser-webpack-plugin'

import { Config as Args } from '../config/argv'

export const minifier = (config: Config, args: Args) => {
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
      parallel: true,
      cache: !args.debug,
      sourceMap: args.sourcemaps,
    },
  ])
}
