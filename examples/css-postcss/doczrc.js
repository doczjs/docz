import { css } from 'docz-plugin-css'

export default {
  plugins: [
    css({
      preprocessor: 'postcss',
      cssmodules: true,
    }),
  ],
}
