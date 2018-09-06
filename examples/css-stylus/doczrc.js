import { css } from 'docz-plugin-css'

export default {
  title: 'CSS Styles',
  plugins: [
    css({
      preprocessor: 'stylus',
      cssmodules: true,
    }),
  ],
}
