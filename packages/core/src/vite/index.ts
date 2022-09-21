/* eslint-disable consistent-return */
import MagicString from 'magic-string';
import ts from 'typescript';

import type { Config } from '../types';
import { docgen } from '../utils/docgen';
import { format } from '../utils/format';
import {
  addImportStatement,
  addMethodStatement,
  createPrinter,
  isNodeExported,
  hasReactComponent,
  setDisplayName,
} from '../utils/ts-program';

const { ESNext } = ts.ScriptTarget;

export function doczVitePlugin(config: Config) {
  return {
    name: 'transform-file',
    enforce: 'pre',

    async transform(source: string, filepath: any) {
      if (filepath.includes(config.src) && filepath.match(/\.(j|t)s(x?)$/)) {
        const docs = await docgen([filepath], config);
        const docResult = (docs?.[0]?.value || []) as any[];
        const code = new MagicString(source);
        const sourceFile = ts.createSourceFile(filepath, source, ESNext);
        const print = createPrinter(sourceFile);

        const exportList = [] as string[];
        sourceFile.forEachChild((node) => {
          try {
            const isReact = hasReactComponent(node, print);
            const isExport = ts.isExportAssignment(node);
            const isExported = isNodeExported(node);
            if (isExport || isExported || isReact) {
              exportList.push(print(ts.getNameOfDeclaration(node as any)!));
            }
            // eslint-disable-next-line no-empty
          } catch (error) {}
        });

        /**
         * add import
         */
        const doczMethod = '__docz_add_component_data__';
        code.prepend(`${print(addImportStatement(doczMethod, 'docz'))}`);

        /**
         * assign components
         */
        for (const displayName of exportList) {
          const docgenInfo = docResult.find(
            (i) => i.displayName === displayName
          );
          const doczStatement = addMethodStatement({
            obj: displayName,
            assign: true,
            method: doczMethod,
            params: {
              displayName,
              filepath,
              docgenInfo,
            },
          });

          code.append(`${print(doczStatement)}`);
          code.append(`${print(setDisplayName(displayName))}`);
        }

        const formatted = await format(code.toString());
        const newCode = new MagicString(formatted);

        return {
          code: newCode.toString(),
          map: newCode.generateMap(),
        };
      }
    },
  };
}
