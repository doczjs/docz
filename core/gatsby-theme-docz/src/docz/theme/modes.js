import * as colors from './colors'

export const light = {
  ...colors,
  primary: colors.blue,
  text: colors.grayDark,
  muted: colors.gray,
  link: colors.blue,
  background: colors.white,
  border: colors.grayLight,
  header: {
    bg: colors.grayExtraLight,
    text: colors.dark,
    border: colors.grayLight,
    button: {
      bg: colors.grayLight,
      color: colors.grayDark,
    },
  },
}

export const dark = {
  ...colors,
  primary: colors.skyBlue,
  text: colors.grayExtraLight,
  muted: colors.gray,
  link: colors.skyBlue,
  background: colors.grayExtraDark,
  border: colors.grayDark,
  header: {
    bg: colors.dark,
    text: colors.grayLight,
    border: colors.grayDark,
    button: {
      bg: colors.grayDark,
      color: colors.white,
    },
  },
}
