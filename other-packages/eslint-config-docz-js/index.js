module.exports = {
  parser: 'babel-eslint',
  extends: ['plugin:react/recommended', 'plugin:prettier/recommended'],
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
    'comma-dangle': ['error', 'always-multiline'],
    'no-mixed-operators': 'error',
    'no-console': 'off',
    'no-undef': 'off',
    'react/prop-types': 'off',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
