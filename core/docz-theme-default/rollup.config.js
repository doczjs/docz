import { config } from 'docz-rollup'

export default config({
  input: './src/index.tsx',
  output: {
    exports: 'named',
  },
})
