import { getProp, getPropValue } from 'jsx-ast-utils';

import { valueFromTraverse } from './ast';
import { strip } from './strip-indent';

export const propFromElement = (prop: string) =>
  valueFromTraverse(
    (p) => p.isJSXOpeningElement(),
    (p) => getPropValue(getProp(p.node.attributes, prop))
  );

export const sanitizeCode = (code: string) => {
  const trimmed = strip(code).trim();
  const newCode =
    trimmed.startsWith('{') && trimmed.endsWith('}')
      ? trimmed.slice(1, trimmed.length - 2).trim()
      : trimmed;

  return strip(newCode);
};

export const componentName = (value: any) => {
  const match = value.match(/^<\\?(\w+)/);
  return match && match[1];
};
