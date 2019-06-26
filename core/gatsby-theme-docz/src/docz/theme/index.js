import moraga from 'typography-theme-moraga'
import { toTheme } from '@theme-ui/typography'
import { merge } from 'lodash/fp'

import * as modes from './modes'

moraga.headerWeight = 700
const typography = toTheme(moraga)

export default merge(typography, {
  initialColorMode: 'light',
  colors: {
    ...modes.light,
    modes: {
      dark: modes.dark,
    },
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  letterSpacings: {
    body: 'normal',
    caps: '0.2em',
  },
  space: [0, 4, 8, 16, 32, 48, 64, 80, 100],
  radii: {
    square: 0,
    radius: 4,
    rounded: 10,
  },
  styles: {
    Container: {
      p: 4,
      maxWidth: 1280,
    },
    root: {
      fontSize: 3,
      color: 'text',
      bg: 'background',
    },
    a: {
      color: 'primary',
      textDecoration: 'none',
      '&:hover': {
        color: 'secondary',
        textDecoration: 'underline',
      },
    },
    h1: {
      fontSize: 6,
    },
    h2: {
      fontSize: 5,
    },
    h3: {
      fontSize: 4,
    },
    h4: {
      fontSize: 3,
    },
    h5: {
      fontSize: 2,
    },
    h6: {
      fontSize: 1,
    },
    li: {
      marginBottom: 1,
    },
    code: {
      fontFamily: 'mono',
    },
  },
})
