import { composeUtil } from './composeUtil';

export const p = composeUtil([
  'paddingTop',
  'paddingBottom',
  'paddingRight',
  'paddingLeft',
]);

export const pt = composeUtil(['paddingTop']);
export const pr = composeUtil(['paddingRight']);
export const pb = composeUtil(['paddingBottom']);
export const pl = composeUtil(['paddingLeft']);
export const px = composeUtil(['paddingLeft', 'paddingRight']);
export const py = composeUtil(['paddingTop', 'paddingBottom']);
