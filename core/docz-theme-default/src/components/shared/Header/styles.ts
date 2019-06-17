import { css } from 'theme-ui'
import * as mixins from '~utils/mixins'

export const wrapper = css({
  bg: 'sidebarBg',
})

export const innerContainer = css({
  ...mixins.centerAlign,
  position: 'relative',
  justifyContent: 'space-between',
})

export const menuButton = css({
  ...mixins.ghostButton,
  color: 'sidebarText',
  opacity: 0.5,
})

export const link = css({
  fontSize: 3,
  fontWeight: 600,
  color: 'sidebarText',
  textDecoration: 'none',
  ':hover': {
    color: 'primary',
  },
})

export const headerButton = css({
  ...mixins.centerAlign,
  outline: 'none',
  p: '12px',
  border: 'none',
  borderRadius: 9999,
  bg: 'buttonBg',
  color: 'buttonColor',
  fontSize: 0,
  fontWeight: 600,
  ':hover': {
    cursor: 'pointer',
  },
})

export const editButton = css({
  ...mixins.centerAlign,
  position: 'absolute',
  bottom: -70,
  right: 0,
  bg: 'transparent',
  color: 'muted',
  fontSize: 1,
  textDecoration: 'none',
  borderRadius: 'radius',
})
