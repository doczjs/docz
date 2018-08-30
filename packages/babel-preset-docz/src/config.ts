interface ConfigParams {
  flow: boolean
  typescript: boolean
  parseProps: boolean
  env: {
    dev: boolean
    prod: boolean
    test: boolean
  }
}

export const config = (opts: ConfigParams) => {
  const presets: any[] = [
    opts.env.test && [
      require('@babel/preset-env').default,
      {
        targets: { node: '6.12' },
      },
    ],
    (opts.env.prod || opts.env.dev) && [
      require('@babel/preset-env').default,
      {
        useBuiltIns: 'entry',
        modules: false,
      },
    ],
    [
      require('@babel/preset-react').default,
      {
        development: opts.env.dev,
        useBuiltIns: true,
      },
    ],
    opts.flow && [require('@babel/preset-flow').default],
    opts.typescript && [require('@babel/preset-typescript').default],
  ].filter(Boolean)

  const plugins: any[] = [
    require('babel-plugin-macros'),
    require('@babel/plugin-transform-destructuring').default,
    [
      require('@babel/plugin-proposal-class-properties').default,
      { loose: true },
    ],
    [
      require('@babel/plugin-proposal-object-rest-spread').default,
      { useBuiltIns: true },
    ],
    [
      require('@babel/plugin-transform-runtime').default,
      { helpers: false, regenerator: true },
    ],
    opts.parseProps && [
      require('babel-plugin-react-docgen').default,
      { resolver: 'findAllExportedComponentDefinitions' },
    ],
    opts.env.prod && [
      require('babel-plugin-transform-react-remove-prop-types').default,
      { removeImport: true },
    ],
    !opts.env.test && [
      require('@babel/plugin-transform-regenerator').default,
      { async: false },
    ],
    require('@babel/plugin-syntax-dynamic-import').default,
    opts.env.test && [require('babel-plugin-transform-dynamic-import').default],
  ].filter(Boolean)

  return {
    presets,
    plugins,
  }
}
