import * as parser from '@babel/parser'
import * as generator from '@babel/generator'
import traverse from '@babel/traverse'
import get from 'lodash.get'

const fromSpecifiers = (specifiers: any = []) =>
  Array.isArray(specifiers) && specifiers.length > 0
    ? specifiers.map(specifier => get(specifier, 'local.name'))
    : []

const traverseOnImports = (fn: (path: any) => any[]) => (node: any) => {
  try {
    const ast = parser.parse(node.value, { sourceType: 'module' })
    let populated: any[] = []

    traverse(ast, {
      enter(path: any): void {
        if (path.isImportDeclaration()) {
          if (get(path, 'node.source.value') !== 'docz') {
            populated = populated.concat(fn(path))
          }
          return
        }
      },
    })

    return populated
  } catch (err) {
    return []
  }
}

export const scopesFromEntry = traverseOnImports((path: any) =>
  fromSpecifiers(path.node.specifiers)
)

export const importsFromEntry = traverseOnImports((path: any) => [
  get(generator.default(path.node), 'code'),
])

type Iterator = (imp: string) => boolean
export const getImportPath = (imports: string[], iterator: Iterator) => {
  const selected = imports.find(iterator)
  const match = selected && selected.match(/(\'|\")(.+)(\'|\")/)
  return match && match[2]
}
