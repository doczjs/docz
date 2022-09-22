import { composeUtil } from './composeUtil';

export const m = composeUtil([
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
]);

export const mt = composeUtil(['marginTop']);
export const mr = composeUtil(['marginRight']);
export const mb = composeUtil(['marginBottom']);
export const ml = composeUtil(['marginLeft']);
export const mx = composeUtil(['marginLeft', 'marginRight']);
export const my = composeUtil(['marginTop', 'marginBottom']);
