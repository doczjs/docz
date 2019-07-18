import * as mixins from '~utils/mixins'

export const wrapper = {
  bg: 'header.bg',
  position: 'relative',
  borderBottom: t => `1px solid ${t.colors.border}`,
}

export const innerContainer = {
  ...mixins.centerAlign,
  px: 4,
  py: '24px',
  position: 'relative',
  justifyContent: 'space-between',
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
