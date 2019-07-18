import { config, copy } from 'docz-rollup'

export default config({
  input: './src/index.ts',
  plugins: [copy('templates', 'dist/templates')],
})
