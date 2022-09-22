import type { CSS } from '@stitches/react';
import { createStitches } from '@stitches/react';

import { lightColors, darkColors } from './colors';
import { media } from './media';
import * as tokens from './tokens';
import * as utils from './utils';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    ...tokens,
    colors: darkColors,
  },
  media,
  utils,
});

export type ThemeUtilsCSS = CSS<typeof config>;

export function cssObj(opts: ThemeUtilsCSS) {
  return opts;
}

export const lightTheme = createTheme('docz_light-theme', {
  colors: lightColors,
});

export const darkTheme = createTheme('docz_dark-theme', {
  colors: darkColors,
});

export { utils };
