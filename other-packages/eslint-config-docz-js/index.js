module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:mdx/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'no-mixed-operators': 'error',
    'no-console': 'off',
    'react/prop-types': 'off',
    'react/no-unknown-property': ['error', { ignore: ['sx'] }],
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.mdx'],
      extends: 'plugin:mdx/recommended',
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
}
