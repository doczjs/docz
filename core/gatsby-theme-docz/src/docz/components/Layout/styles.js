import { media } from '@docz/theme/breakpoints'

export const container = {
  py: 0,
  display: 'grid',
  gridTemplateColumns: '250px 1fr',
  [media.tablet]: {
    display: 'block',
  },
}

export const content = {
  py: 5,
  px: 4,
  [media.tablet]: {
    py: 4,
    px: 0,
  },
}
