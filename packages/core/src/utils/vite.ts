/* eslint-disable consistent-return */
import path from 'path';

import { format } from './format';

import type { Config } from '~/types';

async function addFilemeta(src: string, filepath: string, config: Config) {
  if (!src.includes('__astro_tag_component__')) return;
  const relativeFilepath = path.relative(config.root, filepath);
  const components = src.matchAll(/(__astro_tag_component__)\((\w+)/gm);

  let execs = '';
  for (const comp of components) {
    const component = comp?.[2];
    execs = `
      ${execs}
      ${component} = __addComponentData(${component}, "${component}")
    `;
  }
  const addComponentFn = `
    function __addComponentData(Component, displayName) {
      if (typeof Component !== 'undefined') {
        return new Proxy(Component, {
          get(target, prop, receiver) {
            if (prop === "__filemeta") {
              return { filepath: "${relativeFilepath}", displayName };
            }
            return Reflect.get(...arguments);
          },
        })
      }
      return Component
    }
  `;
  return format(`${src}\n${addComponentFn}\n${execs}`);
}

export function viteExportFilemeta(config: Config) {
  return {
    name: 'transform-file',
    enforce: 'pre',

    async transform(src: any, filepath: any) {
      if (
        filepath.includes(config.src) &&
        filepath.match(/\.(j|t)s(x?)$/) &&
        src.includes('__astro_tag_component__')
      ) {
        const code = await addFilemeta(src, filepath, config);
        return { code };
      }
    },
  };
}
