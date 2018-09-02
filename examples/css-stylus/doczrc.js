import { css } from 'docz-plugin-css'

export default {
  plugins: [
    title: 'CSS Styles',
    css({
      preprocessor: 'stylus',
      cssmodules: true,
    }),
  ],
}
