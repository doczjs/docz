import { load } from 'load-cfg'

import * as paths from '../config/paths'
import { Config } from '../commands/args'

export const loadConfig = (args: Config) =>
  load('docz', {
    ...args,
    paths,
    plugins: [],
    mdPlugins: [],
    hastPlugins: [],
    themeConfig: {},
  })
