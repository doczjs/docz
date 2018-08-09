import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import get from 'lodash.get'

const fromSpecifiers = (specifiers: any = []) =>
  Array.isArray(specifiers) && specifiers.length > 0
    ? specifiers.map(specifier => get(specifier, 'local.name'))
    : []

export const importsFromEntry = (node: any) => {
  try {
    const ast = parser.parse(node.value, { sourceType: 'module' })
    const imports: any[] = []

    traverse(ast, {
      enter(path: any): void {
        if (path.isImportDeclaration()) {
          const sourceValue = get(path, 'node.source.value')

          if (sourceValue !== 'docz') {
            imports.push(...fromSpecifiers(path.node.specifiers))
          }

          return
        }
      },
    })

    return imports
  } catch (err) {
    return []
  }
}
