import { css } from 'docz-plugin-css'

export default {
  plugins: [
    title: 'CSS Sass',
    css({
      preprocessor: 'sass',
      cssmodules: true,
    }),
  ],
}
