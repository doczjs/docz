import { config } from './config'

const validateBool = (name: string, value: any, defaultValue: any) => {
  if (typeof value === 'undefined') {
    value = defaultValue
  }

  if (typeof value !== 'boolean') {
    throw new Error(`Preset react-app: '${name}' option must be a boolean.`)
  }

  return value
}

export interface PresetOptions {
  flow?: boolean
  typescript?: false
  parseProps?: boolean
}

const DEFAULT_OPTS: PresetOptions = {
  flow: false,
  typescript: false,
  parseProps: true,
}

const preset = (api: any, opts: PresetOptions = DEFAULT_OPTS) => {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV
  const isDev = env === 'development'
  const isProd = env === 'production'
  const isTest = env === 'test'

  if (!isDev && !isProd && !isTest) {
    throw new Error(
      'Using `babel-preset-docz` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(env) +
        '.'
    )
  }

  const isFlowEnabled = validateBool('flow', opts.flow, false)
  const isTSEnabled = validateBool('typescript', opts.typescript, false)
  const isParsePropsEnabled = validateBool('parseProps', opts.parseProps, false)

  const parsedOpts = {
    typescript: isTSEnabled,
    flow: isFlowEnabled,
    parseProps: isParsePropsEnabled,
    env: {
      dev: isDev,
      prod: isProd,
      test: isTest,
    },
  }

  return config(parsedOpts)
}

export default preset
