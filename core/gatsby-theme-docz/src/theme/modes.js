import * as colors from './colors'

export const light = {
  ...colors,
  primary: colors.blue,
  text: colors.grayDark,
  muted: colors.gray,
  link: colors.blue,
  background: colors.white,
  border: colors.grayLight,
  sidebar: {
    bg: colors.white,
    navGroup: colors.grayLight,
    navLink: colors.grayDark,
    navLinkActive: colors.blue,
    tocLink: colors.gray,
    tocLinkActive: colors.grayDark,
  },
  header: {
    bg: colors.grayExtraLight,
    text: colors.dark,
    border: colors.grayLight,
    button: {
      bg: colors.grayLight,
      color: colors.grayDark,
    },
  },
  props: {
    bg: colors.grayUltraLight,
    text: colors.grayDark,
    highlight: colors.blue,
    defaultValue: colors.gray,
    descriptionText: colors.grayDark,
    descriptionBg: colors.white,
  },
  playground: {
    bg: colors.white,
    border: colors.grayLight,
  },
  blockquote: {
    bg: colors.grayExtraLight,
    border: colors.grayLight,
    color: colors.gray,
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
  sidebar: {
    bg: colors.grayExtraDark,
    navGroup: colors.gray,
    navLink: colors.grayLight,
    navLinkActive: colors.skyBlue,
    tocLink: colors.gray,
    tocLinkActive: colors.grayLight,
  },
  header: {
    bg: colors.dark,
    text: colors.grayLight,
    border: colors.grayDark,
    button: {
      bg: colors.grayDark,
      color: colors.white,
    },
  },
  props: {
    bg: colors.dark,
    text: colors.gray,
    highlight: colors.skyBlue,
    defaultValue: colors.grayDark,
    descriptionText: colors.gray,
    descriptionBg: colors.grayExtraDark,
  },
  playground: {
    bg: colors.dark,
    border: colors.grayDark,
  },
  blockquote: {
    bg: colors.grayDark,
    border: colors.gray,
    color: colors.gray,
  },
}
