import { css } from 'docz-plugin-css'

export default {
  title: 'CSS Sass',
  plugins: [
    css({
      preprocessor: 'sass',
      cssmodules: true,
    }),
  ],
}
