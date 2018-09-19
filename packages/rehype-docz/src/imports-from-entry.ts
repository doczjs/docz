import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as generator from '@babel/generator'
import get from 'lodash.get'

const fromSpecifiers = (specifiers: any = []) =>
  Array.isArray(specifiers) && specifiers.length > 0
    ? specifiers.map(specifier => get(specifier, 'local.name'))
    : []

export const scopesFromEntry = (node: any) => {
  try {
    const ast = parser.parse(node.value, { sourceType: 'module' })
    const scopes: any[] = []

    traverse(ast, {
      enter(path: any): void {
        if (path.isImportDeclaration()) {
          const sourceValue = get(path, 'node.source.value')

          if (sourceValue !== 'docz') {
            scopes.push(...fromSpecifiers(path.node.specifiers))
          }

          return
        }
      },
    })

    return scopes
  } catch (err) {
    return []
  }
}

export const importsFromEntry = (node: any) => {
  try {
    const ast = parser.parse(node.value, { sourceType: 'module' })
    const imports: any[] = []

    traverse(ast, {
      enter(path: any): void {
        if (path.isImportDeclaration()) {
          const sourceValue = get(path, 'node.source.value')

          if (sourceValue !== 'docz') {
            const { code } = generator.default(path.node)
            imports.push(code)
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
