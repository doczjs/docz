import * as mixins from '~utils/mixins'
import { media } from '~theme/breakpoints'

export const menuIcon = {
  mr: 3,
  display: 'none',
  [media.tablet]: {
    display: 'block',
  },
}

export const wrapper = {
  bg: 'header.bg',
}

export const innerContainer = {
  ...mixins.centerAlign,
  p: 4,
  position: 'relative',
  justifyContent: 'space-between',
}

export const menuButton = {
  ...mixins.ghostButton,
  color: 'header.text',
  opacity: 0.5,
}

export const link = {
  fontSize: 3,
  fontWeight: 600,
  color: 'header.text',
  textDecoration: 'none',
  ':hover': {
    color: 'primary',
  },
}

export const headerButton = {
  ...mixins.centerAlign,
  outline: 'none',
  p: '12px',
  border: 'none',
  borderRadius: 9999,
  bg: 'header.button.bg',
  color: 'header.button.color',
  fontSize: 0,
  fontWeight: 600,
  ':hover': {
    cursor: 'pointer',
  },
}

export const editButton = {
  ...mixins.centerAlign,
  position: 'absolute',
  bottom: -40,
  right: 30,
  bg: 'transparent',
  color: 'muted',
  fontSize: 1,
  textDecoration: 'none',
  borderRadius: 'radius',
}
