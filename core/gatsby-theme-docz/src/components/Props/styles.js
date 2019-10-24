import { breakpoints } from '~theme/breakpoints'
import * as mixins from '~utils/mixins'

export const container = {
  mt: 3,
  mb: 4,
  border: t => `1px solid ${t.colors.border}`,
  borderRadius: 'radius',
  overflow: 'hidden',
  bg: 'props.bg',
  color: 'props.text',
  fontSize: 3,
}

export const content = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  [`@media (min-width: ${breakpoints.tablet}px)`]: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
}

export const line = {
  pt: 2,
  '& + &': {
    borderTop: t => `1px solid ${t.colors.border}`,
  },
}

export const column = {
  minWidth: 0,
  pb: 2,
  px: 3,
  wordWrap: 'break-word',
  '& ~ &': {
    bg: 'red',
  },
}

export const propName = {
  ...column,
  color: 'props.highlight',
}

export const propType = {
  ...column,
  color: 'props.text',
}

export const defaultValue = {
  ...column,
  color: 'props.defaultValue',
}

export const right = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  px: 3,
  flex: 1,
  [`@media (max-width: ${breakpoints.tablet}px)`]: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
}

export const propRequired = {
  color: 'props.text',
  fontSize: 1,
  opacity: 0.5,
}

export const openDescBtn = {
  ...mixins.ghostButton,
  mt: 0,
  ml: 3,
  color: 'props.defaultValue',
}

export const description = {
  fontSize: 2,
  m: 0,
  py: 2,
  px: 3,
  borderTop: t => `1px solid ${t.colors.border}`,
  color: 'props.descriptionText',
  bg: 'props.descriptionBg',
}
