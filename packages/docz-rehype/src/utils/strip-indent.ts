function minIndent(str: string) {
  const match = str.match(/^[ \t]*(?=\S)/gm);
  if (!match) {
    return 0;
  }
  return match.reduce((r, a) => Math.min(r, a.length), Infinity);
}

export function strip(str: string) {
  const indent = minIndent(str);
  if (indent === 0) {
    return str;
  }
  const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm');
  return str.replace(regex, '');
}
