import facepaint from 'facepaint'

export const breakpoints = {
  mobile: 420,
  tablet: 920,
  desktop: 1120,
}

export const mq = (p: any = []) =>
  facepaint([
    `@media(min-width: ${breakpoints.mobile}px)`,
    `@media(min-width: ${breakpoints.tablet}px)`,
    `@media(min-width: ${breakpoints.desktop}px)`,
  ])(p)
