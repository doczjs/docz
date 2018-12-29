import { config } from 'docz-rollup'

export default config({
  input: 'src/index.ts',
  external: id =>
    id === '~db' ||
    id === '~imports' ||
    (!id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/')),
})
