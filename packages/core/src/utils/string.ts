/* eslint-disable no-param-reassign */
import { kebabCase } from 'lodash/fp';

export default function humanizeString(str: string) {
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
