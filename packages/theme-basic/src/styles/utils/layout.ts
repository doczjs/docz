import { composeUtil } from './composeUtil';

export const w = composeUtil(['width']);
export const minW = composeUtil(['minWidth']);
export const maxW = composeUtil(['maxWidth']);
export const h = composeUtil(['height']);
export const minH = composeUtil(['minHeight']);
export const maxH = composeUtil(['maxHeight']);
export const boxSize = composeUtil(['width', 'height']);

export const spaceX = (value: string) => ({
  '& > * + *': {
    marginLeft: value,
  },
});

export const spaceY = (value: string) => ({
  '& > * + *': {
    marginTop: value,
  },
});
