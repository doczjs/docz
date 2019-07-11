import { media } from '~theme/breakpoints'

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
  maxWidth: 960,
  py: 5,
  px: 4,
  [media.tablet]: {
    py: 4,
    px: 4,
  },
}
