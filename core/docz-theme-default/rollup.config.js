import { config } from 'docz-rollup'

export default config({
  input: 'src/index.tsx',
  external: id =>
    !id.startsWith('@components') &&
    !id.startsWith('@utils') &&
    !id.startsWith('@styles'),
})
