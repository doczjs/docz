import * as colors from './colors'
import lighten from 'polished/lib/color/lighten'

export const light = {
  ...colors,
  primary: colors.blue,
  text: colors.grayDark,
  link: colors.blue,
  footerText: colors.grayDark,
  sidebarBg: colors.grayExtraLight,
  sidebarText: colors.dark,
  background: colors.white,
  border: colors.grayLight,
  theadColor: colors.gray,
  theadBg: colors.grayExtraLight,
  tableColor: colors.dark,
  tooltipBg: colors.dark,
  tooltipColor: colors.grayExtraLight,
  codeBg: lighten(0.02, colors.grayExtraLight),
  codeColor: colors.gray,
  preBg: colors.grayExtraLight,
}

export const dark = {
  ...colors,
  primary: colors.skyBlue,
  text: colors.grayExtraLight,
  link: colors.skyBlue,
  footerText: colors.grayLight,
  sidebarBg: colors.dark,
  sidebarText: colors.grayLight,
  background: colors.grayExtraDark,
  border: colors.grayDark,
  theadColor: colors.gray,
  theadBg: colors.grayDark,
  tableColor: colors.grayExtraLight,
  tooltipBg: colors.dark,
  tooltipColor: colors.grayExtraLight,
  codeBg: colors.gray,
  codeColor: colors.grayExtraLight,
  preBg: colors.grayDark,
}
