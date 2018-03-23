import { Arguments } from 'yargs'
import * as historyApiFallback from 'connect-history-api-fallback'
import * as hotMiddleware from 'webpack-hot-middleware'
import * as WebpackDevServer from 'webpack-dev-server'

import { entriesMapper } from './compiler'
import { createCompiler } from './compiler'
import * as paths from './config/paths'

const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'
const HOST = process.env.HOST || '0.0.0.0'

export const server = async ({ files: pattern }: Arguments) => {
  const entries = await entriesMapper(pattern)
  const compiler = await createCompiler(entries)

  const app = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.DIST,
    watchContentBase: true,
    publicPath: '/',
    hot: true,
    quiet: true,
    noInfo: true,
    https: PROTOCOL === 'https',
    host: HOST,
    overlay: false,
    watchOptions: {
      ignored: /node_modules/,
    },
    stats: {
      colors: true,
      chunks: false,
      chunkModules: false,
    },
    before(app: any) {
      app.use(historyApiFallback())
      app.use(hotMiddleware(compiler, { log: false, heartbeat: 2000 }))
    },
  })

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
  })
}
