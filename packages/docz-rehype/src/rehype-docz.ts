import { source } from 'unist-util-source';

import { strip } from './utils/strip-indent';

import { format } from '~/utils/format';

function isPlayground(name: string) {
  return name.includes('Playground');
}

function walk(children: any[], cb: (node: any) => void) {
  for (const node of children) {
    cb(node);
    node.children && walk(node.children, cb);
  }
}

const addComponentsProps = (vfile: any) => async (node: any, idx: number) => {
  if (isPlayground(node.name)) {
    const codes = await Promise.all(
      node.children
        .map((child: any) => format(source(child, vfile)!))
        .map(async (promise: Promise<string>) => {
          const str = await promise;
          if (str.startsWith(';')) return str.slice(1, Infinity);
          return str;
        })
    );
    const code = strip(codes.join(''));
    const attrType = node.attributes.find((attr: any) => attr.name === 'type');
    node.attributes.push(
      { type: 'mdxJsxAttribute', name: '__position', value: idx },
      { type: 'mdxJsxAttribute', name: '__code', value: code }
    );

    walk(node.children, (node) => {
      if (node.type === 'mdxJsxFlowElement') {
        node.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'client:only',
          value: attrType?.value ?? 'react',
        });
      }
    });
  }
};

export interface PluginOpts {
  root: string;
}

export function rehypeDocz() {
  return async (tree: any, vfile: any) => {
    const nodes = tree.children
      .filter((node: any) => node.type.toLowerCase().includes('jsx'))
      .map(addComponentsProps(vfile));

    return Promise.all(nodes).then(() => tree);
  };
}
