declare module 'remark-parse-yaml';
declare module 'unist-util-find';
declare module 'get-pkg-repo';
declare module 'react-docgen';
declare module 'supports-esm';
declare module 'react-docgen/dist/utils/resolveHOC.js';
declare module 'react-docgen/dist/utils/resolveToModule.js';
declare module 'react-docgen/dist/utils/isRequiredPropType.js';
declare module 'react-docgen/dist/babelParser.js';
declare module 'react-docgen/dist/utils/setPropDescription.js';

interface ImportMetaEnv {
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
