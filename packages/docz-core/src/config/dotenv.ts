import fs from 'fs'
import path from 'path'

const appDir = fs.realpathSync(process.cwd())
const resolveApp = (relativePath: any) => path.resolve(appDir, relativePath)

const dotenv = resolveApp('.env')

const NODE_ENV = process.env.NODE_ENV

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${dotenv}.${NODE_ENV}.local`,
  `${dotenv}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `$dotenv}.local`,
  dotenv,
].filter(Boolean)

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
dotenvFiles.forEach(dotenvFile => {
  require('dotenv').config({
    path: dotenvFile,
  })
})

// We support resolving modules according to `NODE_PATH`.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebook/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const appDirectory = fs.realpathSync(process.cwd())
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter)

// Grab NODE_ENV and REACT_APP_ or ANGULAR_APP_ or VUE_APP_* environment variables
// and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const APP_TEST = /^(REACT_APP_)|(ANGULAR_APP_)|(VUE_APP_)/i

interface RT {
  [name: string]: any
}
export const getClientEnvironment = (publicUrl: string) => {
  const raw: RT = Object.keys(process.env)
    .filter(key => APP_TEST.test(key))
    .reduce(
      (env: RT, key) => {
        env[key] = process.env[key]
        return env
      },
      {
        // Useful for determining whether we’re running in production mode. Most
        // importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`. For
        // example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />. This should
        // only be used as an escape hatch. Normally you would put images into the `src`
        // and `import` them in code to get their
        PUBLIC_URL: publicUrl,
      }
    )
  const stringified = {
    'process.env': Object.keys(raw).reduce((env: RT, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {}),
  }

  return { raw, stringified }
}
