import { css } from 'docz-plugin-css'

export default {
  title: 'CSS Less',
  plugins: [
    css({
      preprocessor: 'less',
      cssmodules: true,
    }),
  ],
}
