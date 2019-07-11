import { media } from '~theme/breakpoints'
import * as mixins from '~utils/mixins'

export const main = {
  display: 'flex',
  flexDirection: 'column',
}

export const wrapper = {
  py: 0,
  flex: 1,
  display: 'grid',
  gridTemplateRows: '100%',
  gridTemplateColumns: '250px 1fr',
  [media.tablet]: {
    display: 'block',
  },
}

export const content = {
  position: 'relative',
  maxWidth: 960,
  py: 5,
  px: 4,
  [media.tablet]: {
    py: 4,
    px: 4,
    pt: 5,
  },
}

export const menuIcon = {
  position: 'absolute',
  top: 15,
  left: 30,
  display: 'none',
  [media.tablet]: {
    display: 'block',
  },
}

export const menuButton = {
  ...mixins.ghostButton,
  color: 'header.text',
  opacity: 0.5,
}
