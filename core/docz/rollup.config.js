import { config } from 'docz-rollup'

export default config({
  input: 'src/index.ts',
  external: id =>
    !id.startsWith('\0') &&
    !id.startsWith('.') &&
    !id.startsWith(process.platform === 'win32' ? process.cwd() : '/')
})
