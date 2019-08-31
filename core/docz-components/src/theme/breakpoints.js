const em = px => `${px / 16}em`;
const mountMedia = val => `@media screen and (max-width: ${em(val)})`;

export const breakpoints = {
  mobile: 630,
  tablet: 920,
  desktop: 1120,
};

export const media = {
  mobile: mountMedia(breakpoints.mobile),
  tablet: mountMedia(breakpoints.tablet),
  desktop: mountMedia(breakpoints.desktop),
};
