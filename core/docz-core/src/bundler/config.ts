import { Config as Args, Env } from '../config/argv'
import { ServerHooks as Hooks } from '../lib/Bundler'

import * as paths from '../config/paths'

export const createConfig = (args: Args, env: Env) => async (hooks: Hooks) => {
  return {
    gatsbyConfig: {
      siteMetadata: {
        title: args.title,
        description: args.description,
      },
      __experimentalThemes: [
        {
          resolve: 'gatsby-theme-docz',
          options: {
            ...args,
            root: paths.docz,
          },
        },
      ],
    },
  }
}
