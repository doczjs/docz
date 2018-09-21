import * as path from 'path'
import * as fs from 'fs-extra'
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

export const getFullImports = traverseOnImports((path: any) => [
  get(generator.default(path.node), 'code'),
])

export const getImportsVariables = traverseOnImports((path: any) =>
  fromSpecifiers(path.node.specifiers)
)

const addExtension = (filepath: string) => {
  const ext = ['.js', '.jsx', '.ts', '.tsx'].find(ext =>
    fs.pathExistsSync(`${filepath}${ext}`)
  )

  return `${filepath}${ext}`
}

type Iterator = (imp: string) => boolean
const getImportPath = (imports: string[], iterator: Iterator) => {
  const selected = imports.find(iterator)
  const match = selected && selected.match(/(\'|\")(.+)(\'|\")/)
  return match && match[2]
}

export const findImportPath = (imports: string[]) => (
  cwd: string,
  variable: string
) => {
  const filepath = getImportPath(imports, val => val.includes(variable))
  return (
    filepath &&
    addExtension(
      filepath.startsWith('.') ? path.resolve(cwd, filepath) : filepath
    )
  )
}
