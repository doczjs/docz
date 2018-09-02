import { css } from 'docz-plugin-css'

export default {
  title: 'CSS PostCSS',
  plugins: [
    css({
      preprocessor: 'postcss',
      cssmodules: true,
    }),
  ],
}
