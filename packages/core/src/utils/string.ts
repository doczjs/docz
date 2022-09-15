/* eslint-disable no-param-reassign */
import { kebabCase, capitalize } from 'lodash/fp';

export function humanizeString(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }

  str = kebabCase(str);
  str = str
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  str = str.charAt(0).toUpperCase() + str.slice(1);

  return str;
}

export function titleize(str: string) {
  return str.split(' ').map(capitalize).join(' ');
}
